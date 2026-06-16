import { describe, expect, it } from 'vitest';

import { scoreArticle } from '../../src/services/scoring.service.js';

describe('scoreArticle', () => {
  it('boosts official recent noteworthy articles', () => {
    const official = {
      id: '1',
      title: 'Official release',
      summary: 'summary',
      canonicalUrl: 'https://example.com/1',
      sourceName: 'OpenAI',
      sourceType: 'rss' as const,
      publishedAt: undefined,
      discoveredAt: new Date().toISOString(),
      tags: ['openai'],
      themes: ['model-release'],
      qualitySignals: ['launch', 'model'],
      isOfficial: true,
      isRecent: true,
      isNoteworthy: true,
      editorScore: 80,
      whyRecommended: 'good',
      status: 'active' as const,
    };
    const normal = {
      ...official,
      id: '2',
      canonicalUrl: 'https://example.com/2',
      isOfficial: false,
      isRecent: false,
      isNoteworthy: false,
    };

    expect(scoreArticle(official, [])).toBeGreaterThan(scoreArticle(normal, []));
  });
});
