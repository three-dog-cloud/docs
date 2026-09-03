import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const requiredPages = [
  'index.html',
  'zh/index.html',
  'en/index.html',
  'zh/welcome/index.html',
  'en/welcome/index.html',
  'zh/developer/index.html',
  'en/developer/index.html',
];

export function verifyExport(directory = 'out') {
  for (const page of requiredPages) {
    const html = readFileSync(join(directory, page), 'utf8');
    if (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) {
      throw new Error(`Invalid exported page: ${page}`);
    }
  }

  const assets = readdirSync(join(directory, '_next/static'), { recursive: true });
  for (const extension of ['.js', '.css']) {
    if (!assets.some((file) => file.endsWith(extension))) {
      throw new Error(`Static export is missing ${extension} assets`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  verifyExport();
  console.log(`Verified ${requiredPages.length} exported pages and JS/CSS assets.`);
}
