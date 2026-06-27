/**
 * Script d'administration FamilyXP
 *
 * Crée un utilisateur administrateur dans un environnement donné.
 *
 * Usage :
 *   npx tsx scripts/create-admin-user.ts <env> <email> <password> [displayName]
 *
 * Exemples :
 *   npx tsx scripts/create-admin-user.ts dev david.aili.mx@gmail.com "monMotDePasse" "David"
 *   npx tsx scripts/create-admin-user.ts uat david.aili.mx@gmail.com "monMotDePasse" "David"
 *   npx tsx scripts/create-admin-user.ts prod david.aili.mx@gmail.com "monMotDePasse" "David"
 *
 * ⚠️  Ce script est réservé à l'équipe de développement.
 * ⚠️  Ne jamais exposer la stack technique aux utilisateurs finaux.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Configuration interne ──────────────────────────────────────────────────
// Ces informations sont internes à l'équipe de développement.
// Ne jamais les exposer dans l'interface utilisateur, les logs, ou les messages d'erreur.

const ENVIRONMENTS = ['dev', 'uat', 'prod'] as const
type Env = (typeof ENVIRONMENTS)[number]

interface EnvConfig {
  projectId: string
  serviceAccountPath: string
}

const ENV_CONFIGS: Record<Env, EnvConfig> = {
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

// ─── Validation des arguments ───────────────────────────────────────────────

function validateArgs(): { env: Env; email: string; password: string; displayName: string } {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.error(`
❌ Usage: npx tsx scripts/create-admin-user.ts <env> <email> <password> [displayName]

Arguments :
  env         : dev | uat | prod
  email       : email de l'utilisateur
  password    : mot de passe (min 6 caractères)
  displayName : nom d'affichage (optionnel, défaut: email)

Exemples :
  npx tsx scripts/create-admin-user.ts dev david.aili.mx@gmail.com "monMotDePasse" "David"
  npx tsx scripts/create-admin-user.ts uat david.aili.mx@gmail.com "monMotDePasse" "David"
  npx tsx scripts/create-admin-user.ts prod david.aili.mx@gmail.com "monMotDePasse" "David"
    `)
    process.exit(1)
  }

  const env = args[0] as Env
  if (!ENVIRONMENTS.includes(env)) {
    console.error(`❌ Environnement invalide : "${env}". Utilisez : dev, uat ou prod`)
    process.exit(1)
  }

  const email = args[1]
  if (!email || !email.includes('@')) {
    console.error(`❌ Email invalide : "${email}"`)
    process.exit(1)
  }

  const password = args[2]
  if (password.length < 6) {
    console.error(`❌ Mot de passe trop court (min 6 caractères)`)
    process.exit(1)
  }

  const displayName = args[3] || email.split('@')[0]

  return { env, email, password, displayName }
}

// ─── Fonction principale ────────────────────────────────────────────────────

async function main() {
  const { env, email, password, displayName } = validateArgs()
  const config = ENV_CONFIGS[env]

  console.log(`\nCréation de l'utilisateur administrateur...`)

  // Vérifier le compte de service
  if (!existsSync(config.serviceAccountPath)) {
    console.error(`\n❌ Configuration manquante pour l'environnement "${env}".`)
    console.error(`   Contacte l'équipe de développement pour configurer l'accès.`)
    process.exit(1)
  }

  // Importer le SDK (interne)
  const admin = await import('firebase-admin')

  // Initialiser
  const serviceAccount = JSON.parse(readFileSync(config.serviceAccountPath, 'utf-8'))

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: config.projectId,
    })
  }

  const auth = admin.auth()
  const firestore = admin.firestore()

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    let uid: string
    try {
      const existingUser = await auth.getUserByEmail(email)
      uid = existingUser.uid
      console.log(`ℹ️  Compte existant mis à jour`)
    } catch {
      // 2. Créer l'utilisateur
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      })
      uid = userRecord.uid
      console.log(`✅ Compte créé`)
    }

    // 3. Définir le rôle administrateur
    await auth.setCustomUserClaims(uid, { role: 'admin' })

    // 4. Créer/mettre à jour le profil
    const userRef = firestore.collection('users').doc(uid)
    const userDoc = await userRef.get()

    const now = admin.firestore.Timestamp.now()
    const userData: Record<string, unknown> = {
      displayName,
      email,
      role: 'admin',
      isMinor: false,
      guardianIds: [],
      updatedAt: now,
    }

    if (!userDoc.exists) {
      userData.createdAt = now
    }

    await userRef.set(userData, { merge: true })

    console.log(`\n✅ Utilisateur administrateur prêt : ${email}`)
    console.log(`   Tu peux te connecter avec cet email et le mot de passe fourni.\n`)
  } catch (error: any) {
    // ⚠️  Message générique — ne jamais exposer les détails techniques
    console.error(`\n❌ Erreur lors de la création de l'utilisateur.`)
    console.error(`   Vérifie les informations fournies et réessaie.\n`)
    process.exit(1)
  }
}

main()
