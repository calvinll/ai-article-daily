import { getIsoTimestamp } from '../utils/date.js';
import type { ArticleSeed } from './types.js';

export async function fetchChangelogSource(url: string, sourceName: string): Promise<ArticleSeed[]> {
  const response = await fetch(url, {
    headers: { 'user-agent': 'ai-article-daily/0.1.0' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch changelog source ${sourceName}: ${response.status}`);
  }

  const markdown = await response.text();
  const matches = markdown.matchAll(/- \[(.*?)\]\((.*?)\)/g);
  const articles = Array.from(matches).slice(0, 10).map((match, index) => ({
    id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    title: match[1] ?? `${sourceName} update ${index + 1}`,
    summary: match[1] ?? `${sourceName} update`,
    canonicalUrl: match[2] ?? url,
    sourceName,
    sourceType: 'changelog' as const,
    discoveredAt: getIsoTimestamp(),
    tags: ['changelog'],
    themes: ['product-update'],
    qualitySignals: ['changelog'],
    status: 'active' as const,
    isOfficial: true,
    isRecent: true,
    isNoteworthy: true,
  }));

  return articles;
}
