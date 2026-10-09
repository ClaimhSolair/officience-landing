// Warns on every build while a Career job still has placeholder copy
// (ruling 21k: HR replaces or removes those jobs before the merge to main).
// It warns and does not fail, so the preview still builds.
//
// The check reads content/careers/jobs.ts as text: a job object that holds
// `placeholder: true` is reported by its slug.

import fs from 'node:fs';

const src = fs.readFileSync(new URL('../content/careers/jobs.ts', import.meta.url), 'utf8');
const jobs = src.split(/\n  \{\n/).slice(1);
const flagged = jobs
  .filter((block) => /\n\s+placeholder: true,/.test(block))
  .map((block) => block.match(/slug: '([^']+)'/)?.[1] ?? '(unknown slug)');

if (flagged.length) {
  console.warn(
    `\n⚠  Career: ${flagged.length} job(s) still have placeholder copy: ${flagged.join(', ')}.\n` +
      '   Replace or remove them in content/careers/jobs.ts before the merge to main (ruling 21k).\n',
  );
}
