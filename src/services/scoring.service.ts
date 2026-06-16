import type { Article } from '../types/article.js';
import type { PushRecord } from '../types/push-record.js';

export function scoreArticle(article: Article, history: PushRecord[]): number {
  const base = article.editorScore;
  const officialBoost = article.isOfficial ? 8 : 0;
  const recentBoost = article.isRecent ? 6 : 0;
  const noteworthyBoost = article.isNoteworthy ? 8 : 0;
  const modelBoost = article.themes.includes('model-release') ? 8 : 0;
  const developerBoost = article.themes.includes('developer-tools') ? 6 : 0;
  const industryPenalty = article.themes.includes('industry') ? -10 : 0;
  const repeated = history.some((record) => record.articleId === article.id) ? -20 : 0;
  return base + officialBoost + recentBoost + noteworthyBoost + modelBoost + developerBoost + industryPenalty + repeated;
}
