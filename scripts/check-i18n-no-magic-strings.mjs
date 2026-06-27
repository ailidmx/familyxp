#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'app')

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      out.push(...walk(full))
      continue
    }
    const ext = extname(full)
    if (ext === '.vue' || ext === '.ts' || ext === '.js') out.push(full)
  }
  return out
}

function lineAt(content, index) {
  return content.slice(0, index).split('\n').length
}

function isLikelyUserText(text) {
  const trimmed = text.trim()
  if (!trimmed) return false
  if (trimmed.includes('{{') || trimmed.includes('}}')) return false
  if (!/[A-Za-zÀ-ÿ]/.test(trimmed)) return false
  if (/^[A-Za-z]+\.[A-Za-z0-9_.-]+$/.test(trimmed)) return false
  if (/^[a-z0-9_./-]+$/i.test(trimmed)) return false
  return true
}

function looksUserFacingKey(name) {
  return /(message|label|title|subtitle|placeholder|hint|helper|error|success|warning|info|toast|banner|caption)/i.test(
    name,
  )
}

function scanScriptLike(filePath, source, fullContent, offset = 0) {
  const findings = []

  const assignmentRegex = /([A-Za-z_$][\w$]*(?:\.value)?)\s*=\s*(["'`])([^"'`\n]{2,})\2/g
  let match
  while ((match = assignmentRegex.exec(source)) !== null) {
    const target = match[1] || ''
    const value = (match[3] || '').trim()
    const variableName = target.replace(/\.value$/, '')

    if (!looksUserFacingKey(variableName)) continue
    if (!isLikelyUserText(value)) continue

    const absoluteIndex = offset + match.index
    findings.push({
      filePath,
      line: lineAt(fullContent, absoluteIndex),
      type: 'script-assignment',
      value,
    })
  }

  const uiObjectRegex = /(title|label|placeholder|description|message|text)\s*:\s*(["'`])([^"'`\n]{2,})\2/g
  while ((match = uiObjectRegex.exec(source)) !== null) {
    const value = (match[3] || '').trim()
    if (!isLikelyUserText(value)) continue

    const absoluteIndex = offset + match.index
    findings.push({
      filePath,
      line: lineAt(fullContent, absoluteIndex),
      type: 'script-ui-prop',
      value,
    })
  }

  return findings
}

function scanTemplate(filePath, content) {
  const findings = []
  const templateMatch = content.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/)
  if (!templateMatch || !templateMatch.index) return findings

  const templateStart = templateMatch.index
  const template = templateMatch[1]

  const textNodeRegex = />([^<>\n]+)</g
  let match
  while ((match = textNodeRegex.exec(template)) !== null) {
    const raw = match[1] || ''
    if (!isLikelyUserText(raw)) continue

    const absoluteIndex = templateStart + match.index
    findings.push({
      filePath,
      line: lineAt(content, absoluteIndex),
      type: 'text-node',
      value: raw.trim(),
    })
  }

  const attrRegex = /\s(?:placeholder|title|aria-label|alt|label)="([^"]*[A-Za-zÀ-ÿ][^"]*)"/g
  while ((match = attrRegex.exec(template)) !== null) {
    const value = (match[1] || '').trim()
    if (!value) continue

    const absoluteIndex = templateStart + match.index
    findings.push({
      filePath,
      line: lineAt(content, absoluteIndex),
      type: 'attribute',
      value,
    })
  }

  return findings
}

function scanVueScriptBlocks(filePath, content) {
  const findings = []
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g

  let match
  while ((match = scriptRegex.exec(content)) !== null) {
    const scriptBody = match[1] || ''
    const scriptStart = match.index
    findings.push(
      ...scanScriptLike(filePath, scriptBody, content, scriptStart),
    )
  }

  return findings
}

function scanTsJsFile(filePath, content) {
  return scanScriptLike(filePath, content, content, 0)
}

function main() {
  const files = walk(APP_DIR)
  const findings = []

  for (const filePath of files) {
    if (filePath.includes('/i18n/locales/')) continue

    const content = readFileSync(filePath, 'utf8')
    const ext = extname(filePath)

    if (ext === '.vue') {
      findings.push(...scanTemplate(filePath, content))
      findings.push(...scanVueScriptBlocks(filePath, content))
      continue
    }

    findings.push(...scanTsJsFile(filePath, content))
  }

  if (!findings.length) {
    console.log('check:i18n OK - no magic strings detected in Vue templates')
    process.exit(0)
  }

  console.error('check:i18n FAILED - hardcoded user-facing text detected')
  for (const finding of findings) {
    const rel = relative(ROOT, finding.filePath)
    console.error(`- ${rel}:${finding.line} [${finding.type}] "${finding.value}"`)
  }
  console.error('Use $t("...") and locale files instead of hardcoded strings.')
  process.exit(1)
}

main()
