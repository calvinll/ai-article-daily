import type { Article } from '../types/article.js';
import type { PushRecord } from '../types/push-record.js';
import { scoreArticle } from './scoring.service.js';

export function selectDailyArticles(articles: Article[], history: PushRecord[], maxCount: number): Article[] {
  return [...articles]
    .filter((article) => article.status === 'active')
    .sort((left, right) => scoreArticle(right, history) - scoreArticle(left, history))
    .slice(0, maxCount);
}
