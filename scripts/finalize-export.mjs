import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyExport } from './verify-export.mjs';

export function sourceCommit(env = process.env, readHead = () => execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()) {
  // A hosted build must identify its checked-out source; never silently stamp
  // another provider's SHA or a local checkout when Pages metadata is absent.
  const commit = env.CF_PAGES === '1'
    ? env.CF_PAGES_COMMIT_SHA
    : env.GITHUB_ACTIONS === 'true'
      ? env.GITHUB_SHA
      : readHead();
  if (!/^[0-9a-f]{40}$/.test(commit ?? '')) {
    throw new Error('Missing or invalid source commit for deployment.json');
  }
  return commit;
}

export function finalizeExport(directory = 'out', env = process.env, readHead) {
  verifyExport(directory);
  const commit = sourceCommit(env, readHead);
  writeFileSync(join(directory, 'deployment.json'), JSON.stringify({ commit }, null, 2) + '\n');
  return commit;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(`Verified static export for source ${finalizeExport()}`);
}
