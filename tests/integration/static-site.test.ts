import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createWebServer } from '../../src/cli/web.js';
import { createAppConfig } from '../../src/config/app-config.js';
import { buildStaticSite } from '../../src/server/static-site.service.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildStaticSite', () => {
  it('writes article showcase artifacts', async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), 'ai-article-daily-'));
    await writeFile(path.join(dataDir, 'articles.json'), JSON.stringify([
      {
        id: 'article-1',
        title: 'Frontend polish release',
        summary: 'A small update for the article showcase frontend.',
        canonicalUrl: 'https://example.com/article-1',
        sourceName: 'OpenAI',
        sourceType: 'rss',
        publishedAt: new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        tags: ['openai'],
        themes: ['product-update'],
        qualitySignals: ['launch'],
        isOfficial: true,
        isRecent: true,
        isNoteworthy: true,
        editorScore: 90,
        whyRecommended: '值得关注的前端更新。',
        status: 'active'
      }
    ], null, 2));
    await writeFile(path.join(dataDir, 'push-history.json'), '[]');

    const config = createAppConfig({
      APP_ENV: 'test',
      APP_TIMEZONE: 'Asia/Shanghai',
      WEB_PORT: 4273,
      DATA_DIR: dataDir,
      DAILY_PUSH_CRON: '5 9 * * *',
      DAYS_TO_AVOID_REPEAT: 7,
      MAX_DAILY_RECOMMENDATIONS: 3,
      ARTICLE_SOURCE_OPENAI_RSS: 'https://openai.com/news/rss.xml',
      ARTICLE_SOURCE_HF_RSS: 'https://huggingface.co/blog/feed.xml',
      ARTICLE_SOURCE_GOOGLE_AI_RSS: 'https://blog.google/technology/ai/rss/',
      ARTICLE_SOURCE_OPENAI_CHANGELOG: undefined,
      ARTICLE_SOURCE_ANTHROPIC_RELEASE_NOTES: undefined,
      ARTICLE_SOURCE_VERCEL_AI_SDK_CHANGELOG: undefined,
    }, '/Users/bytedance/Desktop/claude-pratice/ai-article-daily');

    const distDir = await buildStaticSite(config);
    const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
    const archiveHtml = await readFile(path.join(distDir, 'archive.html'), 'utf8');
    const articleHtml = await readFile(path.join(distDir, 'article.html'), 'utf8');
    const articlesJson = await readFile(path.join(distDir, 'data', 'articles.json'), 'utf8');
    const detailsJson = await readFile(path.join(distDir, 'data', 'article-details.json'), 'utf8');

    expect(indexHtml).toContain('每日 AI 推荐');
    expect(indexHtml).toContain('article-reset-filters');
    expect(archiveHtml).toContain('历史归档');
    expect(archiveHtml).toContain('history-reset-filters');
    expect(articleHtml).toContain('文章详情');
    expect(articleHtml).toContain('面包屑导航');
    expect(articlesJson).toContain('publishedAt');
    expect(detailsJson).toContain('[');
  });

  it('serves built assets with correct content types', async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), 'ai-article-daily-server-'));
    await writeFile(path.join(dataDir, 'articles.json'), '[]');
    await writeFile(path.join(dataDir, 'push-history.json'), '[]');

    const config = createAppConfig({
      APP_ENV: 'test',
      APP_TIMEZONE: 'Asia/Shanghai',
      WEB_PORT: 4273,
      DATA_DIR: dataDir,
      DAILY_PUSH_CRON: '5 9 * * *',
      DAYS_TO_AVOID_REPEAT: 7,
      MAX_DAILY_RECOMMENDATIONS: 3,
      ARTICLE_SOURCE_OPENAI_RSS: 'https://openai.com/news/rss.xml',
      ARTICLE_SOURCE_HF_RSS: 'https://huggingface.co/blog/feed.xml',
      ARTICLE_SOURCE_GOOGLE_AI_RSS: 'https://blog.google/technology/ai/rss/',
      ARTICLE_SOURCE_OPENAI_CHANGELOG: undefined,
      ARTICLE_SOURCE_ANTHROPIC_RELEASE_NOTES: undefined,
      ARTICLE_SOURCE_VERCEL_AI_SDK_CHANGELOG: undefined,
    }, '/Users/bytedance/Desktop/claude-pratice/ai-article-daily');

    const distDir = await buildStaticSite(config);
    const server = createWebServer(distDir);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));

    try {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('Unexpected server address');

      const assetResponse = await fetch(`http://127.0.0.1:${address.port}/assets/app.js`);
      const dataResponse = await fetch(`http://127.0.0.1:${address.port}/data/articles.json`);
      const homeResponse = await fetch(`http://127.0.0.1:${address.port}/`);

      expect(assetResponse.headers.get('content-type')).toContain('application/javascript');
      expect(dataResponse.headers.get('content-type')).toContain('application/json');
      expect(homeResponse.headers.get('content-type')).toContain('text/html');
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
