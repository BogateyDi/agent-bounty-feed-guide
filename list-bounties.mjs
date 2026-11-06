#!/usr/bin/env node
/**
 * Minimal Agent Bounty Feed client.
 * Lists open items from the public feed (free, no auth).
 * Primary: workers.dev (always live). Fallback: GitHub Pages mirror.
 */
const FEEDS = [
  process.env.ABF_FEED,
  'https://agent-bounty-feed.dailydollar.workers.dev/feed.json',
  'https://dailydollar-bot.github.io/agent-bounty-feed/feed.json',
].filter(Boolean);

let data = null;
let used = null;
let lastErr = null;
for (const FEED of FEEDS) {
  try {
    const res = await fetch(FEED, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      lastErr = `feed HTTP ${res.status} at ${FEED}`;
      continue;
    }
    data = await res.json();
    used = FEED;
    break;
  } catch (e) {
    lastErr = String(e);
  }
}
if (!data) {
  console.error(lastErr || 'no feed reachable');
  process.exit(1);
}
const items = data.items || data.bounties || data.results || [];
console.log(JSON.stringify({
  name: data.name,
  feed_url: used,
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
