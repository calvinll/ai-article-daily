import type { Article } from '../types/article.js';

function normalizeCanonicalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const params = new URLSearchParams(parsed.search);

    for (const key of Array.from(params.keys())) {
      if (/^utm_/i.test(key) || ['ref', 'ref_src', 'source'].includes(key)) {
        params.delete(key);
      }
    }

    parsed.search = params.toString() ? `?${params.toString()}` : '';
    parsed.hash = '';
    parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/';
    return parsed.toString();
  } catch {
    return url;
  }
}

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const normalizedUrl = normalizeCanonicalUrl(article.canonicalUrl);
    if (seen.has(normalizedUrl)) {
      return false;
    }
    seen.add(normalizedUrl);
    return true;
  });
}
