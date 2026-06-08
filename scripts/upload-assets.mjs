// Uploads every file in assets-src/ to the Cloudflare R2 "redesign" bucket.
// Auth + bucket come from .env (git-ignored). Run with: npm run upload-assets
//
// Each file is uploaded preserving its relative path as the R2 object key, so
// assets-src/icons/foo.svg -> https://pub-3721...r2.dev/icons/foo.svg
import { execSync } from 'node:child_process';
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'assets-src');
const ENV = join(ROOT, '.env');

// --- load .env (no external dependency) ---
if (existsSync(ENV)) {
  for (const line of readFileSync(ENV, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const BUCKET = process.env.R2_BUCKET || 'redesign';
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error('✗ Missing CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID in .env');
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`✗ No assets-src/ folder found at ${SRC}`);
  process.exit(1);
}

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name !== '.gitkeep') out.push(full);
  }
  return out;
}

const files = walk(SRC);
if (files.length === 0) {
  console.log('Nothing to upload — assets-src/ is empty.');
  process.exit(0);
}

console.log(`Uploading ${files.length} file(s) to R2 bucket "${BUCKET}"...\n`);
let ok = 0;
for (const file of files) {
  const key = relative(SRC, file).split('\\').join('/');
  const ct = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  try {
    execSync(
      `npx wrangler r2 object put "${BUCKET}/${key}" --file "${file}" --content-type "${ct}" --remote`,
      { stdio: 'inherit', env: process.env, cwd: ROOT }
    );
    console.log(`✓ ${key}`);
    ok++;
  } catch {
    console.error(`✗ failed: ${key}`);
  }
}
console.log(`\nDone: ${ok}/${files.length} uploaded → https://pub-37210447316445838bf89f8613ac9ea5.r2.dev/<key>`);
