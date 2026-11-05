import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

function run(script) {
  const r = spawnSync(process.execPath, [join(root, script)], {
    encoding: 'utf8',
    timeout: 30000,
  });
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const json = JSON.parse(r.stdout);
  return json;
}

test('list-bounties returns feed metadata and sample items', () => {
  const j = run('list-bounties.mjs');
  assert.ok(j.count >= 1);
  assert.ok(Array.isArray(j.sample));
  assert.ok(j.sample.length >= 1);
  assert.ok(j.sample[0].url);
});

test('earn-now returns curated items and mcp url', () => {
  const j = run('earn-now.mjs');
  assert.ok(j.count >= 1);
  assert.match(String(j.mcp || ''), /mcp/);
  assert.ok(Array.isArray(j.top));
});
