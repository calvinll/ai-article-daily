export type ArticleSeed = {
  id: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  sourceName: string;
  sourceType: 'rss' | 'changelog' | 'manual';
  publishedAt?: string;
  discoveredAt: string;
  tags: string[];
  themes: string[];
  qualitySignals: string[];
  isOfficial: boolean;
  isRecent: boolean;
  isNoteworthy: boolean;
};
