import { describe, expect, it } from 'vitest';

import { selectDailyArticles } from '../../src/services/selection.service.js';

function createArticle(id: string, sourceName: string, editorScore: number) {
  return {
    id,
    title: id,
    summary: `${id} summary`,
    canonicalUrl: `https://example.com/${id}`,
    sourceName,
    sourceType: 'rss' as const,
    publishedAt: new Date().toISOString(),
    discoveredAt: new Date().toISOString(),
    tags: [sourceName.toLowerCase()],
    themes: ['ai-updates'],
    qualitySignals: [],
    isOfficial: true,
    isRecent: true,
    isNoteworthy: false,
    editorScore,
    whyRecommended: 'good',
    status: 'active' as const,
  };
}

describe('selectDailyArticles', () => {
  it('adds source diversity instead of letting one source dominate', () => {
    const articles = [
      createArticle('openai-top', 'OpenAI', 95),
      createArticle('openai-second', 'OpenAI', 92),
      createArticle('openai-third', 'OpenAI', 90),
      createArticle('hf-top', 'Hugging Face', 89),
      createArticle('google-top', 'Google AI', 88),
    ];

    const selected = selectDailyArticles(articles, [], 3);

    expect(selected).toHaveLength(3);
    expect(selected[0]?.sourceName).toBe('OpenAI');
    expect(selected.some((article) => article.sourceName === 'Hugging Face')).toBe(true);
    expect(selected.some((article) => article.sourceName === 'Google AI')).toBe(true);
  });

  it('still respects article quality for the top pick', () => {
    const articles = [
      createArticle('openai-top', 'OpenAI', 95),
      createArticle('hf-top', 'Hugging Face', 89),
      createArticle('google-top', 'Google AI', 88),
    ];

    const selected = selectDailyArticles(articles, [], 2);

    expect(selected[0]?.id).toBe('openai-top');
  });
});
