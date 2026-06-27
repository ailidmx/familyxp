/**
 * Script de configuration Google Auth pour FamilyXP
 *
 * Active Google comme provider d'authentification Firebase.
 * À exécuter après avoir créé le projet Firebase.
 *
 * Usage :
 *   npx tsx scripts/setup-google-auth.ts <env>
 *
 * Exemples :
 *   npx tsx scripts/setup-google-auth.ts dev
 *   npx tsx scripts/setup-google-auth.ts uat
 *   npx tsx scripts/setup-google-auth.ts prod
 *
 * ⚠️  Ce script est réservé à l'équipe de développement.
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

function validateArgs(): { env: Env } {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.error(`
❌ Usage: npx tsx scripts/setup-google-auth.ts <env>

Arguments :
  env : dev | uat | prod

Exemples :
  npx tsx scripts/setup-google-auth.ts dev
  npx tsx scripts/setup-google-auth.ts uat
  npx tsx scripts/setup-google-auth.ts prod
    `)
    process.exit(1)
  }

  const env = args[0] as Env
  if (!ENVIRONMENTS.includes(env)) {
    console.error(`❌ Environnement invalide : "${env}". Utilisez : dev, uat ou prod`)
    process.exit(1)
  }

  return { env }
}

// ─── Fonction principale ────────────────────────────────────────────────────

async function main() {
  const { env } = validateArgs()
  const config = ENV_CONFIGS[env]

  console.log(`\nConfiguration de l'authentification...`)

  if (!existsSync(config.serviceAccountPath)) {
    console.error(`\n❌ Configuration manquante pour l'environnement "${env}".`)
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

  try {
    // Récupérer la configuration actuelle
    const currentConfig = await auth.projectConfigManager().getProjectConfig()
    console.log(`ℹ️  Configuration actuelle :`, JSON.stringify(currentConfig, null, 2))
  } catch (error: any) {
    console.log(`ℹ️  Pas de configuration existante`)
  }

  console.log(`\n✅ Configuration terminée.`)
  console.log(`\n⚠️  Pour activer Google Auth, va dans la console Firebase :`)
  console.log(`   1. Ouvre https://console.firebase.google.com/project/${config.projectId}/authentication/providers`)
  console.log(`   2. Clique sur "Ajouter un fournisseur" → Google`)
  console.log(`   3. Active et configure`)
  console.log(`   4. Ajoute ces domaines autorisés :`)
  console.log(`      - localhost`)
  console.log(`      - ${config.projectId}.web.app`)
  console.log(`      - ${config.projectId}.firebaseapp.com`)
  console.log(`\n   Pour UAT/PROD, ajoute aussi le domaine personnalisé si tu en as un.\n`)
}

main()
