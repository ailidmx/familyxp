/**
 * Script d'administration FamilyXP
 *
 * Définit le rôle administrateur sur un utilisateur existant (par email).
 * Utile après une première connexion via Google.
 *
 * Usage :
 *   npx tsx scripts/set-admin-role.ts <env> <email>
 *
 * Exemples :
 *   npx tsx scripts/set-admin-role.ts dev david.aili.mx@gmail.com
 *   npx tsx scripts/set-admin-role.ts uat david.aili.mx@gmail.com
 *   npx tsx scripts/set-admin-role.ts prod david.aili.mx@gmail.com
 *
 * ⚠️  Ce script est réservé à l'équipe de développement.
 * ⚠️  Ne jamais exposer la stack technique aux utilisateurs finaux.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Configuration interne ──────────────────────────────────────────────────

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

// ─── Validation ─────────────────────────────────────────────────────────────

function validateArgs(): { env: Env; email: string } {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error(`
❌ Usage: npx tsx scripts/set-admin-role.ts <env> <email>

Arguments :
  env   : dev | uat | prod
  email : email de l'utilisateur à promouvoir administrateur

Exemples :
  npx tsx scripts/set-admin-role.ts dev david.aili.mx@gmail.com
  npx tsx scripts/set-admin-role.ts uat david.aili.mx@gmail.com
  npx tsx scripts/set-admin-role.ts prod david.aili.mx@gmail.com
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

  return { env, email }
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

  const admin = await import('firebase-admin')
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
    // 1. Récupérer l'utilisateur par email
    let uid: string
    try {
      const user = await auth.getUserByEmail(email)
      uid = user.uid
    } catch {
      console.error(`\n❌ Aucun utilisateur trouvé avec l'email : ${email}`)
      console.error(`   L'utilisateur doit d'abord se connecter une fois via Google.`)
      process.exit(1)
    }

    // 2. Définir le rôle admin
    await auth.setCustomUserClaims(uid, { role: 'admin' })

    // 3. Mettre à jour le profil Firestore
    const userRef = firestore.collection('users').doc(uid)
    const now = admin.firestore.Timestamp.now()

    await userRef.set(
      {
        email,
        role: 'admin',
        isMinor: false,
        guardianIds: [],
        updatedAt: now,
      },
      { merge: true }
    )

    console.log(`\n✅ Rôle administrateur attribué : ${email}\n`)
  } catch {
    console.error(`\n❌ Erreur lors de la mise à jour du rôle.`)
    console.error(`   Vérifie les informations et réessaie.\n`)
    process.exit(1)
  }
}

main()
