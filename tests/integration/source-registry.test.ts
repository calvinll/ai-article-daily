import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchAllSources } from '../../src/sources/source-registry.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fetchAllSources', () => {
  it('collects seeds from configured sources', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => '<rss><channel><item><title>Test</title><link>https://example.com/a</link><description>Summary</description></item></channel></rss>',
      }),
    );

    const items = await fetchAllSources({
      app: { env: 'test', timezone: 'Asia/Shanghai', dataDir: './data', webPort: 4273 },
      schedule: { dailyPushCron: '5 9 * * *' },
      recommendation: { daysToAvoidRepeat: 7, maxDailyRecommendations: 3 },
      channels: { feishu: { enabled: false, webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/test' } },
      sources: {
        openaiRss: 'https://openai.com/news/rss.xml',
        huggingFaceRss: 'https://huggingface.co/blog/feed.xml',
        googleAiRss: 'https://blog.google/technology/ai/rss/',
      },
    });

    expect(items.length).toBeGreaterThan(0);
  });
});
