#!/usr/bin/env node
/**
 * Translation Coverage Verification Script
 * Checks if all translation keys exist in all languages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');

function loadLocale(lang) {
  const filepath = path.join(LOCALES_DIR, `${lang}.ts`);
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Extract keys from the translation object (simple parser)
  const keys = [];
  const matches = content.matchAll(/(\w+):/g);
  for (const match of matches) {
    keys.push(match[1]);
  }
  
  return new Set(keys);
}

function getAllKeys(lang) {
  const filepath = path.join(LOCALES_DIR, `${lang}.ts`);
  const content = fs.readFileSync(filepath, 'utf-8');
  
  // Extract all keys including nested ones
  const keys = new Set();
  
  // Match simple keys: key: 'value' or key: "value"
  const simpleMatches = content.matchAll(/^\s*(\w+):\s*['"]/gm);
  for (const match of matches) {
    keys.add(match[1]);
  }
  
  // Match nested object keys
  const nestedMatches = content.matchAll(/(\w+):\s*{/g);
  for (const match of nestedMatches) {
    keys.add(match[1]);
  }
  
  return keys;
}

function main() {
  console.log('🔍 Verifying Translation Coverage...\n');
  
  const languages = ['fa', 'en', 'de'];
  const keysByLang = {};
  
  // Load all keys from each language
  for (const lang of languages) {
    try {
      keysByLang[lang] = getAllKeys(lang);
      console.log(`✓ Loaded ${keysByLang[lang].size} keys from ${lang}.ts`);
    } catch (error) {
      console.error(`✗ Error loading ${lang}.ts:`, error.message);
      process.exit(1);
    }
  }
  
  console.log('\n📊 Coverage Analysis:\n');
  
  // Use Persian as the reference (most complete)
  const referenceKeys = keysByLang['fa'];
  let hasIssues = false;
  
  for (const lang of ['en', 'de']) {
    const langKeys = keysByLang[lang];
    const missing = [];
    
    for (const key of referenceKeys) {
      if (!langKeys.has(key)) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0) {
      hasIssues = true;
      console.log(`❌ ${lang.toUpperCase()}: Missing ${missing.length} keys:`);
      missing.slice(0, 10).forEach(key => console.log(`   - ${key}`));
      if (missing.length > 10) {
        console.log(`   ... and ${missing.length - 10} more`);
      }
      console.log('');
    } else {
      console.log(`✅ ${lang.toUpperCase()}: All keys present (${langKeys.size} keys)`);
    }
  }
  
  if (hasIssues) {
    console.log('\n⚠️  Translation files are INCOMPLETE. Some keys are missing.');
    console.log('   Please complete all translation files before deploying to production.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All translation files are complete!\n');
    process.exit(0);
  }
}

main();
