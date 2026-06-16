import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchRssSource } from '../../src/sources/rss.source.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchRssSource', () => {
  it('classifies and suppresses low-value non-core posts', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<rss><channel><item><title>Our new community investments in Virginia support local jobs and expand energy affordability.</title><link>https://example.com/a</link><description>Community investment update</description><pubDate>Mon, 15 Jun 2026 15:00:00 GMT</pubDate></item></channel></rss>',
      }),
    );

    const items = await fetchRssSource('https://example.com/feed.xml', 'Google AI');

    expect(items[0]?.themes).toContain('industry');
    expect(items[0]?.status).toBe('suppressed');
  });

  it('classifies developer-heavy posts as noteworthy', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<rss><channel><item><title>Introducing a new Agents SDK for developer workflows</title><link>https://example.com/b</link><description>Build tools with workflow automation</description><pubDate>Mon, 15 Jun 2026 15:00:00 GMT</pubDate></item></channel></rss>',
      }),
    );

    const items = await fetchRssSource('https://example.com/feed.xml', 'OpenAI');

    expect(items[0]?.themes).toContain('developer-tools');
    expect(items[0]?.isNoteworthy).toBe(true);
    expect(items[0]?.status).toBe('active');
  });
});
