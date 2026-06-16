import type { Article } from '../types/article.js';
import type { PushRecord } from '../types/push-record.js';

export type TodayArticleViewModel = {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  themes: string[];
  canonicalUrl: string;
  whyRecommended: string;
  isOfficial: boolean;
  isRecent: boolean;
  isNoteworthy: boolean;
};

export type ArticleSummaryViewModel = {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  themes: string[];
  tags: string[];
  sourceType: Article['sourceType'];
  canonicalUrl: string;
  whyRecommended: string;
  isOfficial: boolean;
  isRecent: boolean;
  isNoteworthy: boolean;
};

export type ArticleDetailViewModel = {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceType: Article['sourceType'];
  themes: string[];
  tags: string[];
  canonicalUrl: string;
  whyRecommended: string;
  publishedAt: Article['publishedAt'];
  isOfficial: boolean;
  isRecent: boolean;
  isNoteworthy: boolean;
};

export type HistoryItemViewModel = {
  date: string;
  articleId: string;
  title: string;
  sourceName: string;
  status: PushRecord['status'];
  themes: string[];
};

export function buildTodayArticle(article: Article | undefined): TodayArticleViewModel | null {
  if (!article) return null;
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    sourceName: article.sourceName,
    themes: article.themes,
    canonicalUrl: article.canonicalUrl,
    whyRecommended: article.whyRecommended,
    isOfficial: article.isOfficial,
    isRecent: article.isRecent,
    isNoteworthy: article.isNoteworthy,
  };
}

export function buildArticleSummaries(articles: Article[]): ArticleSummaryViewModel[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    sourceName: article.sourceName,
    themes: article.themes,
    tags: article.tags,
    sourceType: article.sourceType,
    canonicalUrl: article.canonicalUrl,
    whyRecommended: article.whyRecommended,
    isOfficial: article.isOfficial,
    isRecent: article.isRecent,
    isNoteworthy: article.isNoteworthy,
  }));
}

export function buildArticleDetails(articles: Article[]): ArticleDetailViewModel[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    sourceName: article.sourceName,
    sourceType: article.sourceType,
    themes: article.themes,
    tags: article.tags,
    canonicalUrl: article.canonicalUrl,
    whyRecommended: article.whyRecommended,
    publishedAt: article.publishedAt,
    isOfficial: article.isOfficial,
    isRecent: article.isRecent,
    isNoteworthy: article.isNoteworthy,
  }));
}

export function buildHistoryItems(records: PushRecord[], articles: Article[] = []): HistoryItemViewModel[] {
  const articleMap = new Map(articles.map((article) => [article.id, article]));
  return records.map((record) => ({
    date: record.date,
    articleId: record.articleId,
    title: record.title,
    sourceName: record.sourceName,
    status: record.status,
    themes: articleMap.get(record.articleId)?.themes ?? [],
  }));
}
