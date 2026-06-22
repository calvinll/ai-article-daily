import { describe, expect, it } from 'vitest';

import { deduplicateArticles } from '../../src/services/dedup.service.js';

describe('deduplicateArticles', () => {
  it('removes duplicates by canonical URL', () => {
    const items = [
      { canonicalUrl: 'https://example.com/a' },
      { canonicalUrl: 'https://example.com/a' },
      { canonicalUrl: 'https://example.com/b' },
    ] as any;

    expect(deduplicateArticles(items)).toHaveLength(2);
  });

  it('normalizes tracking parameters before deduplicating', () => {
    const items = [
      { canonicalUrl: 'https://example.com/a?utm_source=x&utm_medium=y' },
      { canonicalUrl: 'https://example.com/a' },
      { canonicalUrl: 'https://example.com/b?ref=test' },
    ] as any;

    expect(deduplicateArticles(items)).toHaveLength(2);
  });
});
