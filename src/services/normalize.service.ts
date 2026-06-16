import { articleSchema, type Article } from '../types/article.js';
import type { ArticleSeed } from '../sources/types.js';

function buildEditorScore(seed: ArticleSeed): number {
  let score = 70;
  if (seed.isOfficial) score += 8;
  if (seed.isRecent) score += 6;
  if (seed.isNoteworthy) score += 8;
  if (seed.themes.includes('model-release')) score += 8;
  if (seed.themes.includes('developer-tools')) score += 6;
  if (seed.themes.includes('research')) score += 6;
  if (seed.qualitySignals.includes('developer')) score += 4;
  if (seed.qualitySignals.includes('model')) score += 4;
  if (seed.qualitySignals.includes('research')) score += 4;
  if (seed.qualitySignals.includes('industry')) score -= 8;
  return Math.min(100, score);
}

function buildWhyRecommended(seed: ArticleSeed): string {
  if (seed.themes.includes('model-release')) {
    return `这是 ${seed.sourceName} 近期和模型能力相关的更新，适合优先关注。`;
  }

  if (seed.themes.includes('developer-tools')) {
    return `这篇内容更偏开发者和工具链，适合想了解 AI 工程实践的人优先阅读。`;
  }

  if (seed.themes.includes('research')) {
    return `这篇内容更偏研究与评测，适合跟踪方法进展和技术趋势。`;
  }

  if (seed.isNoteworthy) {
    return `来自 ${seed.sourceName} 的近期重点更新，值得优先阅读。`;
  }

  if (seed.isRecent) {
    return `来自 ${seed.sourceName} 的近期更新，适合快速了解最新动态。`;
  }

  return `来自 ${seed.sourceName} 的高质量内容，适合纳入每日推荐。`;
}

export function normalizeArticles(seeds: ArticleSeed[]): Article[] {
  return seeds.map((seed, index) => articleSchema.parse({
    id: `${seed.sourceName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    title: seed.title,
    summary: seed.summary,
    canonicalUrl: seed.canonicalUrl,
    sourceName: seed.sourceName,
    sourceType: seed.sourceType,
    publishedAt: seed.publishedAt ?? null,
    discoveredAt: seed.discoveredAt,
    tags: seed.tags,
    themes: seed.themes,
    qualitySignals: seed.qualitySignals,
    isOfficial: seed.isOfficial,
    isRecent: seed.isRecent,
    isNoteworthy: seed.isNoteworthy,
    editorScore: buildEditorScore(seed),
    whyRecommended: buildWhyRecommended(seed),
    status: 'active',
  }));
}
