import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchAllSources } from '../../src/sources/source-registry.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchAllSources', () => {
  it('collects seeds from configured RSS and changelog sources', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL) => {
        const url = String(input);
        if (url.includes('changelog')) {
          return Promise.resolve({
            ok: true,
            text: async () => '- [OpenAI changelog item](https://example.com/changelog)',
          });
        }

        return Promise.resolve({
          ok: true,
          text: async () => '<rss><channel><item><title>Test</title><link>https://example.com/a</link><description>Summary</description></item></channel></rss>',
        });
      }),
    );

    const items = await fetchAllSources({
      app: { env: 'test', timezone: 'Asia/Shanghai', dataDir: './data', webPort: 4273 },
      schedule: { dailyPushCron: '5 9 * * *' },
      recommendation: { daysToAvoidRepeat: 7, maxDailyRecommendations: 3 },
      sources: {
        openaiRss: 'https://openai.com/news/rss.xml',
        huggingFaceRss: 'https://huggingface.co/blog/feed.xml',
        googleAiRss: 'https://blog.google/technology/ai/rss/',
        openaiChangelog: 'https://example.com/changelog.md',
        anthropicReleaseNotes: undefined,
        vercelAiSdkChangelog: undefined,
      },
    });

    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item) => item.sourceType === 'changelog')).toBe(true);
  });

  it('continues when one source fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: string | URL) => {
        const url = String(input);
        if (url.includes('huggingface')) {
          return Promise.resolve({ ok: false, status: 500 });
        }

        return Promise.resolve({
          ok: true,
          text: async () => '<rss><channel><item><title>Test</title><link>https://example.com/a</link><description>Summary</description></item></channel></rss>',
        });
      }),
    );

    const items = await fetchAllSources({
      app: { env: 'test', timezone: 'Asia/Shanghai', dataDir: './data', webPort: 4273 },
      schedule: { dailyPushCron: '5 9 * * *' },
      recommendation: { daysToAvoidRepeat: 7, maxDailyRecommendations: 3 },
      sources: {
        openaiRss: 'https://openai.com/news/rss.xml',
        huggingFaceRss: 'https://huggingface.co/blog/feed.xml',
        googleAiRss: 'https://blog.google/technology/ai/rss/',
        openaiChangelog: undefined,
        anthropicReleaseNotes: undefined,
        vercelAiSdkChangelog: undefined,
      },
    });

    expect(items.length).toBeGreaterThan(0);
  });
});
