import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAppConfig } from '../../src/config/app-config.js';
import { buildStaticSite } from '../../src/server/static-site.service.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildStaticSite', () => {
  it('writes article showcase artifacts', async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), 'ai-article-daily-'));
    await writeFile(path.join(dataDir, 'articles.json'), '[]');
    await writeFile(path.join(dataDir, 'push-history.json'), '[]');

    const config = createAppConfig({
      APP_ENV: 'test',
      APP_TIMEZONE: 'Asia/Shanghai',
      WEB_PORT: 4273,
      DATA_DIR: dataDir,
      DAILY_PUSH_CRON: '5 9 * * *',
      FEISHU_ENABLED: false,
      FEISHU_WEBHOOK_URL: 'https://open.feishu.cn/open-apis/bot/v2/hook/test',
      FEISHU_BOT_SECRET: undefined,
      FEISHU_REQUIRED_KEYWORD: undefined,
      DAYS_TO_AVOID_REPEAT: 7,
      MAX_DAILY_RECOMMENDATIONS: 3,
      ARTICLE_SOURCE_OPENAI_RSS: 'https://openai.com/news/rss.xml',
      ARTICLE_SOURCE_HF_RSS: 'https://huggingface.co/blog/feed.xml',
      ARTICLE_SOURCE_GOOGLE_AI_RSS: 'https://blog.google/technology/ai/rss/',
    }, '/Users/bytedance/Desktop/claude-pratice/ai-article-daily');

    const distDir = await buildStaticSite(config);
    const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
    const archiveHtml = await readFile(path.join(distDir, 'archive.html'), 'utf8');
    const articleHtml = await readFile(path.join(distDir, 'article.html'), 'utf8');
    const articlesJson = await readFile(path.join(distDir, 'data', 'articles.json'), 'utf8');
    const detailsJson = await readFile(path.join(distDir, 'data', 'article-details.json'), 'utf8');

    expect(indexHtml).toContain('每日 AI 推荐');
    expect(archiveHtml).toContain('历史归档');
    expect(articleHtml).toContain('文章详情');
    expect(articlesJson).toContain('[');
    expect(detailsJson).toContain('[');
  });
});
