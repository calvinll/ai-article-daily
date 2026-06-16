import type { Article } from '../types/article.js';

export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    if (seen.has(article.canonicalUrl)) {
      return false;
    }
    seen.add(article.canonicalUrl);
    return true;
  });
}
