import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { requiredPages, verifyExport } from './verify-export.mjs';

function fixture(t, { missingPage, invalidPage, missingAsset } = {}) {
  const directory = mkdtempSync(join(tmpdir(), 'tdcloud-export-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const page of requiredPages) {
    if (page === missingPage) continue;
    mkdirSync(dirname(join(directory, page)), { recursive: true });
    writeFileSync(join(directory, page), page === invalidPage ? '' : '<html><body>Docs</body></html>');
  }
  mkdirSync(join(directory, '_next/static/chunks'), { recursive: true });
  for (const extension of ['.js', '.css']) {
    if (extension !== missingAsset) writeFileSync(join(directory, `_next/static/chunks/app${extension}`), 'asset');
  }
  return directory;
}

test('accepts a complete bilingual static export', (t) => {
  assert.doesNotThrow(() => verifyExport(fixture(t)));
});

for (const page of requiredPages) {
  test(`rejects a missing page: ${page}`, (t) => {
    assert.throws(() => verifyExport(fixture(t, { missingPage: page })), /ENOENT/);
  });
}

test('rejects an empty exported page', (t) => {
  assert.throws(() => verifyExport(fixture(t, { invalidPage: 'zh/welcome/index.html' })), /Invalid exported page/);
});

for (const extension of ['.js', '.css']) {
  test(`rejects missing ${extension} assets`, (t) => {
    assert.throws(() => verifyExport(fixture(t, { missingAsset: extension })), /missing .* assets/);
  });
}
