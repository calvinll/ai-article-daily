import type { Article } from '../types/article.js';
import type { PushRecord } from '../types/push-record.js';
import { isWithinDays } from '../utils/date.js';

function getRecencyBoost(article: Article): number {
  if (!article.publishedAt) {
    return article.isRecent ? 4 : 0;
  }

  const ageMs = Date.now() - new Date(article.publishedAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  if (ageHours <= 24) return 10;
  if (ageHours <= 72) return 7;
  if (ageHours <= 7 * 24) return 4;
  return 0;
}

function getRepeatPenalty(article: Article, history: PushRecord[]): number {
  const exactRepeat = history.some((record) => record.articleId === article.id);
  const recentSourceCount = history.filter(
    (record) => record.sourceName === article.sourceName && isWithinDays(record.createdAt, new Date(), 7),
  ).length;
  return (exactRepeat ? 24 : 0) + recentSourceCount * 5;
}

function getSourceWeight(sourceName: string): number {
  if (sourceName === 'OpenAI') return 3;
  if (sourceName === 'Hugging Face') return 4;
  if (sourceName === 'Google AI') return 2;
  return 0;
}

export function scoreArticle(article: Article, history: PushRecord[]): number {
  const base = article.editorScore;
  const officialBoost = article.isOfficial ? 8 : 0;
  const recencyBoost = getRecencyBoost(article);
  const noteworthyBoost = article.isNoteworthy ? 8 : 0;
  const modelBoost = article.themes.includes('model-release') ? 8 : 0;
  const developerBoost = article.themes.includes('developer-tools') ? 6 : 0;
  const researchBoost = article.themes.includes('research') ? 6 : 0;
  const productBoost = article.themes.includes('product-update') ? 4 : 0;
  const launchBoost = article.qualitySignals.includes('launch') ? 4 : 0;
  const industryPenalty = article.themes.includes('industry') ? -10 : 0;
  const sourceWeight = getSourceWeight(article.sourceName);
  const repeatedPenalty = getRepeatPenalty(article, history);
  return base + officialBoost + recencyBoost + noteworthyBoost + modelBoost + developerBoost + researchBoost + productBoost + launchBoost + sourceWeight + industryPenalty - repeatedPenalty;
}
