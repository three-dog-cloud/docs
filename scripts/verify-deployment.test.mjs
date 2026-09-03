import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const commit = 'a'.repeat(40);
const verifier = fileURLToPath(new URL('./verify-deployment.mjs', import.meta.url));

async function verifyFixture(t, { missing, deployedCommit = commit } = {}) {
  const server = createServer((request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === missing) {
      response.writeHead(404).end('Not found');
    } else if (path === '/deployment.json') {
      response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ commit: deployedCommit }));
    } else if (path.endsWith('.js')) {
      response.writeHead(200, { 'content-type': 'application/javascript' }).end('console.log("docs")');
    } else if (path.endsWith('.css')) {
      response.writeHead(200, { 'content-type': 'text/css' }).end('body {}');
    } else {
      response.writeHead(200, { 'content-type': 'text/html' }).end(
        '<html><head><link href="/_next/static/app.css" rel="stylesheet"></head><body><script src="/_next/static/app.js"></script>Docs</body></html>',
      );
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const child = spawn(process.execPath, [verifier, `http://127.0.0.1:${server.address().port}`, commit], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', resolve);
  });
  return { code, output };
}

test('accepts a deployed source with working pages and assets', async (t) => {
  const result = await verifyFixture(t);
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /Verified live deployment/);
});

for (const missing of ['/deployment.json', '/zh/welcome/', '/_next/static/app.css']) {
  test(`rejects a successful deployment whose ${missing} returns 404`, async (t) => {
    const result = await verifyFixture(t, { missing });
    assert.notEqual(result.code, 0);
    assert.match(result.output, /HTTP 404/);
  });
}

test('rejects an accessible site that still serves an older source version', async (t) => {
  const result = await verifyFixture(t, { deployedCommit: 'b'.repeat(40) });
  assert.notEqual(result.code, 0);
  assert.match(result.output, /does not match/);
});
