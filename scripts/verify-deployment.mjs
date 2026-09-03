import { requiredPages } from './verify-export.mjs';

const [base, expectedCommit] = process.argv.slice(2);
if (!base || !/^[0-9a-f]{40}$/.test(expectedCommit ?? '')) {
  throw new Error('Usage: pnpm verify:deployment <site-url> <40-character-source-commit>');
}
const baseUrl = new URL(base.endsWith('/') ? base : `${base}/`);
if (!['http:', 'https:'].includes(baseUrl.protocol)) throw new Error('Expected an HTTP(S) site URL');

async function request(path, contentType) {
  const url = new URL(path, baseUrl);
  url.searchParams.set('verify_commit', expectedCommit);
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const actualType = response.headers.get('content-type') ?? '';
  if (!contentType.test(actualType)) throw new Error(`${url}: unexpected Content-Type ${actualType}`);
  return response;
}

const metadata = await (await request('deployment.json', /application\/json/i)).json();
if (metadata.commit !== expectedCommit) {
  throw new Error(`Deployed source ${metadata.commit} does not match ${expectedCommit}`);
}
const assets = new Set();
for (const page of requiredPages) {
  const route = page.replace(/index\.html$/, '');
  const html = await (await request(route, /text\/html/i)).text();
  if (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) throw new Error(`Invalid HTML: ${route || '/'}`);
  for (const match of html.matchAll(/(?:src|href)="([^"<>]*\/_next\/static\/[^"<>]+\.(?:js|css)(?:\?[^"<>]*)?)"/g)) {
    assets.add(match[1].replaceAll('&amp;', '&'));
  }
  console.log(`Verified page ${route || '/'}`);
}
for (const extension of ['.js', '.css']) {
  if (![...assets].some((path) => new URL(path, baseUrl).pathname.endsWith(extension))) {
    throw new Error(`Published pages do not reference ${extension} assets`);
  }
}
const assetPaths = [...assets];
for (let offset = 0; offset < assetPaths.length; offset += 4) {
  await Promise.all(assetPaths.slice(offset, offset + 4).map(async (asset) => {
    const isScript = new URL(asset, baseUrl).pathname.endsWith('.js');
    const response = await request(asset, isScript ? /(?:javascript|ecmascript)/i : /text\/css/i);
    await response.arrayBuffer();
  }));
}
console.log(`Verified ${assetPaths.length} referenced JS/CSS assets`);
console.log(`Verified live deployment ${baseUrl} at ${expectedCommit}`);
