#!/usr/bin/env node

/**
 * Script d'administration FamilyXP
 *
 * Définit le rôle administrateur sur un utilisateur existant (par email).
 * Utilise l'API REST Firebase Identity Toolkit avec un service account.
 *
 * Usage :
 *   node scripts/set-admin-role.mjs <env> <email>
 *
 * Exemples :
 *   node scripts/set-admin-role.mjs dev david.aili.mx@gmail.com
 *   node scripts/set-admin-role.mjs uat david.aili.mx@gmail.com
 *   node scripts/set-admin-role.mjs prod david.aili.mx@gmail.com
 *
 * ⚠️  Ce script est réservé à l'équipe de développement.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Configuration interne ──────────────────────────────────────────────────

const ENVIRONMENTS = ['dev', 'uat', 'prod']
const ENV_CONFIGS = {
  dev: {
    projectId: 'famillyxp',
    serviceAccountPath: resolve(__dirname, 'service-accounts', 'service-account-dev.json'),
  },
  uat: {
    projectId: 'familyxp-uat',
    serviceAccountPath: resolve(__dirname, 'service-accounts', 'service-account-uat.json'),
  },
  prod: {
    projectId: 'familyxp-prod',
    serviceAccountPath: resolve(__dirname, 'service-accounts', 'service-account-prod.json'),
  },
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validateArgs() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error(`
❌ Usage: node scripts/set-admin-role.mjs <env> <email>

Arguments :
  env   : dev | uat | prod
  email : email de l'utilisateur à promouvoir administrateur

Exemples :
  node scripts/set-admin-role.mjs dev david.aili.mx@gmail.com
  node scripts/set-admin-role.mjs uat david.aili.mx@gmail.com
  node scripts/set-admin-role.mjs prod david.aili.mx@gmail.com
    `)
    process.exit(1)
  }

  const env = args[0]
  if (!ENVIRONMENTS.includes(env)) {
    console.error(`❌ Environnement invalide : "${env}". Utilisez : dev, uat ou prod`)
    process.exit(1)
  }

  const email = args[1]
  if (!email || !email.includes('@')) {
    console.error(`❌ Email invalide : "${email}"`)
    process.exit(1)
  }

  return { env, email }
}

// ─── Obtenir un access token via service account ────────────────────────────

async function getAccessToken(serviceAccount) {
  const { private_key, client_email } = serviceAccount
  const now = Math.floor(Date.now() / 1000)

  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: client_email,
    sub: client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase.database',
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/identitytoolkit',
    ].join(' '),
  }

  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  const signature = b64(header) + '.' + b64(payload)

  const crypto = await import('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signature)
  sign.end()

  const sig = sign.sign(private_key, 'base64url')
  const jwt = signature + '.' + sig

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Erreur OAuth: ${resp.status} ${err}`)
  }

  const data = await resp.json()
  return data.access_token
}

// ─── Fonction principale ────────────────────────────────────────────────────

async function main() {
  const { env, email } = validateArgs()
  const config = ENV_CONFIGS[env]

  console.log(`\nMise à jour du rôle administrateur...`)

  if (!existsSync(config.serviceAccountPath)) {
    console.error(`\n❌ Configuration manquante pour l'environnement "${env}".`)
    console.error(`   Contacte l'équipe de développement.`)
    process.exit(1)
  }

  const serviceAccount = JSON.parse(readFileSync(config.serviceAccountPath, 'utf-8'))
  const projectId = config.projectId

  try {
    // 1. Obtenir un access token
    console.log('   Obtention du token...')
    const token = await getAccessToken(serviceAccount)

    // 2. Récupérer l'utilisateur par email
    console.log(`   Recherche de l'utilisateur : ${email}`)
    const lookupResp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: [email] }),
      }
    )

    if (!lookupResp.ok) {
      console.error(`\n❌ Aucun utilisateur trouvé avec l'email : ${email}`)
      console.error(`   L'utilisateur doit d'abord se connecter une fois.`)
      process.exit(1)
    }

    const lookupData = await lookupResp.json()
    const users = lookupData.users || []

    if (users.length === 0) {
      console.error(`\n❌ Aucun utilisateur trouvé avec l'email : ${email}`)
      console.error(`   L'utilisateur doit d'abord se connecter une fois.`)
      process.exit(1)
    }

    const uid = users[0].localId
    console.log(`   Utilisateur trouvé : ${uid}`)

    // 3. Définir les claims (rôle admin)
    console.log('   Attribution du rôle admin...')
    const claimsResp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: uid,
          customAttributes: JSON.stringify({ role: 'admin' }),
        }),
      }
    )

    if (!claimsResp.ok) {
      const err = await claimsResp.text()
      throw new Error(`Erreur claims: ${err}`)
    }

    // 4. Mettre à jour le profil Firestore
    console.log('   Mise à jour du profil Firestore...')
    const now = new Date().toISOString()

    const firestoreResp = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=email&updateMask.fieldPaths=role&updateMask.fieldPaths=isMinor&updateMask.fieldPaths=guardianIds&updateMask.fieldPaths=updatedAt`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fields: {
            email: { stringValue: email },
            role: { stringValue: 'admin' },
            isMinor: { booleanValue: false },
            guardianIds: { arrayValue: { values: [] } },
            updatedAt: { timestampValue: now },
          },
        }),
      }
    )

    if (!firestoreResp.ok && firestoreResp.status === 404) {
      // Créer le document s'il n'existe pas
      const createResp = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users?documentId=${uid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fields: {
              email: { stringValue: email },
              role: { stringValue: 'admin' },
              isMinor: { booleanValue: false },
              guardianIds: { arrayValue: { values: [] } },
              createdAt: { timestampValue: now },
              updatedAt: { timestampValue: now },
            },
          }),
        }
      )

      if (!createResp.ok) {
        const err = await createResp.text()
        console.error(`   ⚠️  Firestore: ${err}`)
      }
    }

    console.log(`\n✅ Rôle administrateur attribué : ${email}\n`)
  } catch (error) {
    console.error(`\n❌ Erreur : ${error.message}\n`)
    process.exit(1)
  }
}

main()
