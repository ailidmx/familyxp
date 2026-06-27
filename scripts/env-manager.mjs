#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = process.cwd()
const activeFile = resolve(repoRoot, '.env.active')

const envMap = {
  local: '.env.local',
  dev: '.env.dev',
  uat: '.env.uat',
  prod: '.env.prod'
}

function extractValue(content, key) {
  const line = content
    .split('\n')
    .find((row) => row.trim().startsWith(`${key}=`))

  if (!line) return 'n/a'
  return line.slice(line.indexOf('=') + 1).trim() || 'n/a'
}

function printEnvSummary(envName, filePath) {
  const content = readFileSync(filePath, 'utf8')
  const appEnv = extractValue(content, 'NUXT_PUBLIC_APP_ENV')
  const projectId = extractValue(content, 'NUXT_PUBLIC_FIREBASE_PROJECT_ID')

  console.log(`Environnement: ${envName}`)
  console.log(`Fichier source: ${filePath}`)
  console.log(`NUXT_PUBLIC_APP_ENV: ${appEnv}`)
  console.log(`NUXT_PUBLIC_FIREBASE_PROJECT_ID: ${projectId}`)
}

function listEnvironments() {
  console.log('Environnements disponibles:')
  for (const [name, file] of Object.entries(envMap)) {
    const fullPath = resolve(repoRoot, file)
    const status = existsSync(fullPath) ? 'ok' : 'manquant'
    console.log(`- ${name}: ${file} (${status})`)
  }
}

function showActiveEnvironment() {
  if (!existsSync(activeFile)) {
    console.log('Aucun environnement actif. Utilise: npm run env:use -- <local|dev|uat|prod>')
    return
  }

  printEnvSummary('active', activeFile)
}

function useEnvironment(envName) {
  const sourceFile = envMap[envName]

  if (!sourceFile) {
    console.error(`Environnement invalide: ${envName}`)
    console.error('Valeurs acceptées: local, dev, uat, prod')
    process.exit(1)
  }

  const sourcePath = resolve(repoRoot, sourceFile)
  if (!existsSync(sourcePath)) {
    console.error(`Fichier introuvable: ${sourceFile}`)
    console.error('Crée ce fichier en copiant .env.example puis réessaie.')
    process.exit(1)
  }

  copyFileSync(sourcePath, activeFile)
  console.log(`.env.active -> ${sourceFile}`)
  printEnvSummary(envName, sourcePath)
  console.log('Commande recommandée: npm run dev:active')
}

const [command, value] = process.argv.slice(2)

switch (command) {
  case 'list':
    listEnvironments()
    break
  case 'show':
    showActiveEnvironment()
    break
  case 'use':
    useEnvironment(value)
    break
  default:
    console.log('Usage:')
    console.log('  npm run env:list')
    console.log('  npm run env:show')
    console.log('  npm run env:use -- <local|dev|uat|prod>')
    process.exit(1)
}
