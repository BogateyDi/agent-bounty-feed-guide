#!/usr/bin/env node
/**
 * Minimal Agent Bounty Feed client.
 * Lists open items from the public feed.json (free, no auth).
 */
const FEED = process.env.ABF_FEED || 'https://dailydollar-bot.github.io/agent-bounty-feed/feed.json';

const res = await fetch(FEED, { headers: { Accept: 'application/json' } });
if (!res.ok) {
  console.error(`feed HTTP ${res.status}`);
  process.exit(1);
}
const data = await res.json();
const items = data.items || data.bounties || data.results || [];
console.log(JSON.stringify({
  name: data.name,
  generated_at: data.generated_at,
  count: data.count ?? items.length,
  total_open_usd_equiv: data.total_open_usd_equiv,
  sample: items.slice(0, 5).map((it) => ({
    id: it.id,
    title: it.title,
    est_usd: it.est_usd ?? it.reward_usd ?? it.amount,
    source: it.source,
    url: it.url,
    deadline: it.deadline,
    requires: it.requires,
  })),
}, null, 2));
