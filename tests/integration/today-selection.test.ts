import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { createAppConfig } from '../../src/config/app-config.js';
import { WebApiService } from '../../src/server/web-api.service.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('WebApiService.getToday', () => {
  it('returns the first active unrecommended article for the homepage', async () => {
    const dataDir = await mkdtemp(path.join(os.tmpdir(), 'ai-article-today-'));
    await writeFile(path.join(dataDir, 'articles.json'), JSON.stringify([
      {
        id: 'article-1',
        title: 'First article',
        summary: 'summary',
        canonicalUrl: 'https://example.com/1',
        sourceName: 'OpenAI',
        sourceType: 'rss',
        publishedAt: new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        tags: ['openai'],
        themes: ['model-release'],
        qualitySignals: ['model'],
        isOfficial: true,
        isRecent: true,
        isNoteworthy: true,
        editorScore: 90,
        whyRecommended: 'good',
        status: 'active'
      },
      {
        id: 'article-2',
        title: 'Second article',
        summary: 'summary',
        canonicalUrl: 'https://example.com/2',
        sourceName: 'Hugging Face',
        sourceType: 'rss',
        publishedAt: new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        tags: ['hugging-face'],
        themes: ['research'],
        qualitySignals: ['research'],
        isOfficial: true,
        isRecent: true,
        isNoteworthy: true,
        editorScore: 88,
        whyRecommended: 'good',
        status: 'active'
      }
    ], null, 2));
    await writeFile(path.join(dataDir, 'push-history.json'), JSON.stringify([
      {
        id: '1',
        date: '2026-06-17',
        articleId: 'article-1',
        title: 'First article',
        sourceName: 'OpenAI',
        channel: 'web',
        status: 'success',
        createdAt: new Date().toISOString()
      }
    ], null, 2));

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
    }, '/Users/bytedance/Desktop/claude-pratice/ai-article-daily');

    const api = new WebApiService(config);
    const today = await api.getToday();

    expect(today?.id).toBe('article-2');
  });
});
