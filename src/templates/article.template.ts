import type { Article } from '../types/article.js';

export function renderArticleDigest(articles: Article[]): string {
  if (articles.length === 0) {
    return '今日没有可推荐的 AI 文章。';
  }

  return [
    '今日 AI 推荐',
    '',
    ...articles.map((article, index) => `${index + 1}. ${article.title}\n来源：${article.sourceName}\n推荐理由：${article.whyRecommended}\n链接：${article.canonicalUrl}`),
  ].join('\n\n');
}
