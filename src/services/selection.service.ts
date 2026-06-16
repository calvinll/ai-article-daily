import type { Article } from '../types/article.js';
import type { PushRecord } from '../types/push-record.js';
import { scoreArticle } from './scoring.service.js';

const SAME_SOURCE_PENALTY = 12;

export function selectDailyArticles(articles: Article[], history: PushRecord[], maxCount: number): Article[] {
  const remaining = [...articles].filter((article) => article.status === 'active');
  const selected: Article[] = [];

  while (remaining.length > 0 && selected.length < maxCount) {
    remaining.sort((left, right) => {
      const leftPenalty = selected.filter((article) => article.sourceName === left.sourceName).length * SAME_SOURCE_PENALTY;
      const rightPenalty = selected.filter((article) => article.sourceName === right.sourceName).length * SAME_SOURCE_PENALTY;
      return (scoreArticle(right, history) - rightPenalty) - (scoreArticle(left, history) - leftPenalty);
    });

    const next = remaining.shift();
    if (!next) break;
    selected.push(next);
  }

  return selected;
}
