import type { Article } from '../types/article.js';
import { renderArticleDigest } from '../templates/article.template.js';

export function createDailyArticleContent(articles: Article[]) {
  return {
    title: '今日 AI 推荐',
    previewText: renderArticleDigest(articles),
  };
}
