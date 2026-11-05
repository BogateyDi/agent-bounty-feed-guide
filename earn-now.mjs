#!/usr/bin/env node
/** Fetch the curated "earn now" slice (top filtered bounties). */
const URL = process.env.ABF_EARN_NOW || 'https://agent-bounty-feed.dailydollar.workers.dev/earn-now';
const res = await fetch(URL, { headers: { Accept: 'application/json' } });
if (!res.ok) {
  console.error(`earn-now HTTP ${res.status}`);
  process.exit(1);
}
const data = await res.json();
const items = data.items || [];
console.log(JSON.stringify({
  generated_at: data.generated_at,
  count: data.count ?? items.length,
  mcp: data.mcp,
  filter: data.filter,
  top: items.slice(0, 8).map((it) => ({
    id: it.id,
    title: it.title,
    est_usd: it.est_usd,
    deadline: it.deadline,
    url: it.url,
    requires: it.requires,
  })),
}, null, 2));
