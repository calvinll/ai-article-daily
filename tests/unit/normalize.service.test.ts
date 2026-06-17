import { describe, expect, it } from 'vitest';

import { normalizeArticles } from '../../src/services/normalize.service.js';

describe('normalizeArticles', () => {
  it('preserves suppressed status from source seeds', () => {
    const articles = normalizeArticles([
      {
        id: '1',
        title: 'Local jobs update',
        summary: 'community investment and local jobs',
        canonicalUrl: 'https://example.com/1',
        sourceName: 'Google AI',
        sourceType: 'rss',
        publishedAt: new Date().toISOString(),
        discoveredAt: new Date().toISOString(),
        tags: ['google-ai'],
        themes: ['industry'],
        qualitySignals: ['industry'],
        status: 'suppressed',
        isOfficial: true,
        isRecent: true,
        isNoteworthy: false,
      },
    ]);

    expect(articles[0]?.status).toBe('suppressed');
  });
});
