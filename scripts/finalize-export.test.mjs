import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { finalizeExport, sourceCommit } from './finalize-export.mjs';
import { requiredPages } from './verify-export.mjs';

const commit = 'a'.repeat(40);
const cloudflare = { CF_PAGES: '1', CF_PAGES_COMMIT_SHA: commit };

test('Cloudflare source wins over another provider and the local checkout', () => {
  assert.equal(sourceCommit({ ...cloudflare, GITHUB_SHA: 'b'.repeat(40) }, () => 'c'.repeat(40)), commit);
});

test('a hosted build fails when its source metadata is missing or invalid', () => {
  for (const env of [
    { CF_PAGES: '1', GITHUB_SHA: commit },
    { ...cloudflare, CF_PAGES_COMMIT_SHA: 'main' },
    { GITHUB_ACTIONS: 'true' },
  ]) {
    assert.throws(() => sourceCommit(env, () => commit), /Missing or invalid source commit/);
  }
});

test('manual GitHub validation and local builds identify their own source', () => {
  assert.equal(sourceCommit({ GITHUB_ACTIONS: 'true', GITHUB_SHA: commit }), commit);
  assert.equal(sourceCommit({}, () => commit), commit);
});

test('only a complete static export receives a deployment stamp', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'tdcloud-finalize-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.throws(() => finalizeExport(directory, cloudflare), /ENOENT/);
  assert.equal(existsSync(join(directory, 'deployment.json')), false);
  for (const page of requiredPages) {
    mkdirSync(dirname(join(directory, page)), { recursive: true });
    writeFileSync(join(directory, page), '<html><body>Docs</body></html>');
  }
  mkdirSync(join(directory, '_next/static'), { recursive: true });
  writeFileSync(join(directory, '_next/static/app.js'), 'asset');
  writeFileSync(join(directory, '_next/static/app.css'), 'asset');
  assert.equal(finalizeExport(directory, cloudflare), commit);
  assert.deepEqual(JSON.parse(readFileSync(join(directory, 'deployment.json'), 'utf8')), { commit });
});
