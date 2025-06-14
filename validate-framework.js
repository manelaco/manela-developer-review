import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, './package.json'), 'utf8'));

console.log('🔍 Framework Validation Check');
console.log('============================');

// Check package.json
const hasNext = pkg.dependencies?.next || pkg.devDependencies?.next;
const hasVite = pkg.dependencies?.vite || pkg.devDependencies?.vite;
const scripts = pkg.scripts || {};

console.log('📦 Package.json:');
console.log(`  Next.js: ${hasNext ? '✅ Found' : '❌ Missing'}`);
console.log(`  Vite: ${hasVite ? '⚠️  Found (should be removed)' : '✅ Not found'}`);
console.log(`  Dev script: ${scripts.dev}`);

// Check config files
const hasNextConfig = fs.existsSync('next.config.js') || fs.existsSync('next.config.ts');
const hasViteConfig = fs.existsSync('vite.config.js') || fs.existsSync('vite.config.ts');
const hasIndexHtml = fs.existsSync('index.html');

console.log('\n📁 Config Files:');
console.log(`  next.config.js: ${hasNextConfig ? '✅ Found' : '❌ Missing'}`);
console.log(`  vite.config.*: ${hasViteConfig ? '⚠️  Found (should be removed)' : '✅ Not found'}`);
console.log(`  index.html: ${hasIndexHtml ? '⚠️  Found (should be removed)' : '✅ Not found'}`);

// Check pages structure
const hasPagesDir = fs.existsSync('src/pages');
const hasAppDir = fs.existsSync('src/app');

console.log('\n🗂️  Routing Structure:');
console.log(`  src/pages/: ${hasPagesDir ? '✅ Found (Pages Router)' : '❌ Missing'}`);
console.log(`  src/app/: ${hasAppDir ? '✅ Found (App Router)' : '✅ Not found'}`);

// Overall assessment
const isNextJs = hasNext && hasNextConfig && !hasVite && !hasViteConfig && !hasIndexHtml;
const isVite = hasVite && hasViteConfig && hasIndexHtml && !hasNext;

console.log('\n🎯 Framework Assessment:');
if (isNextJs) {
  console.log('✅ CONFIRMED: Next.js project');
} else if (isVite) {
  console.log('⚠️  WARNING: Vite project detected');
} else {
  console.log('❌ MIXED/UNCLEAR: Framework configuration issues detected');
}

console.log('\n' + '='.repeat(40)); 