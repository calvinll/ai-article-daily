import { getIsoTimestamp } from '../utils/date.js';
import type { ArticleSeed } from './types.js';

function extractItems(xml: string): string[] {
  if (xml.includes('<item>')) {
    return xml.split('<item>').slice(1).map((chunk) => `<item>${chunk}`);
  }

  if (xml.includes('<entry>')) {
    return xml.split('<entry>').slice(1).map((chunk) => `<entry>${chunk}`);
  }

  return [];
}

function getTagValue(item: string, tag: string): string | undefined {
  const match = item.match(new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function classifyThemes(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const themes = new Set<string>();

  if (/model|gpt|gemini|claude|llama|reasoning/.test(text)) themes.add('model-release');
  if (/api|sdk|developer|agent|tool|workflow|mcp/.test(text)) themes.add('developer-tools');
  if (/research|paper|benchmark|eval|training/.test(text)) themes.add('research');
  if (/product|launch|introducing|release|availability|feature/.test(text)) themes.add('product-update');
  if (/enterprise|policy|security|partnership|investment/.test(text)) themes.add('industry');
  if (themes.size === 0) themes.add('ai-updates');

  return Array.from(themes);
}

function collectQualitySignals(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const signals = new Set<string>();

  if (/introducing|launch|release|available|new/.test(text)) signals.add('launch');
  if (/model|gpt|gemini|claude|llama/.test(text)) signals.add('model');
  if (/api|sdk|developer|agent|tool|workflow|mcp/.test(text)) signals.add('developer');
  if (/research|paper|benchmark|eval|training/.test(text)) signals.add('research');
  if (/enterprise|policy|security|partnership|investment|community/.test(text)) signals.add('industry');

  return Array.from(signals);
}

function isNoteworthy(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return /introducing|launch|release|available|open source|new|benchmark|agent|model/.test(text);
}

function shouldSuppress(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return /community investment|jobs|regional investment|energy affordability|local jobs/.test(text);
}

export async function fetchRssSource(url: string, sourceName: string): Promise<ArticleSeed[]> {
  const response = await fetch(url, {
    headers: { 'user-agent': 'ai-article-daily/0.1.0' },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS source ${sourceName}: ${response.status}`);
  }

  const xml = await response.text();
  return extractItems(xml).slice(0, 20).map((item, index) => {
    const title = stripHtml(getTagValue(item, 'title') ?? `${sourceName} article ${index + 1}`);
    const canonicalUrl = stripHtml(
      getTagValue(item, 'link') ??
        getTagValue(item, 'id') ??
        `${url}#${index + 1}`,
    );
    const summary = stripHtml(
      getTagValue(item, 'description') ??
        getTagValue(item, 'summary') ??
        title,
    );
    const publishedAt = toIsoDate(
      getTagValue(item, 'pubDate') ??
        getTagValue(item, 'published') ??
        getTagValue(item, 'updated'),
    );
    const discoveredAt = getIsoTimestamp();
    const publishedDate = publishedAt ? new Date(publishedAt) : new Date(discoveredAt);
    const ageMs = Date.now() - publishedDate.getTime();
    const isRecent = ageMs <= 7 * 24 * 60 * 60 * 1000;

    const qualitySignals = collectQualitySignals(title, summary);
    const noteworthy = isNoteworthy(title, summary);
    const suppressed = shouldSuppress(title, summary);

    return {
      id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      title,
      summary,
      canonicalUrl,
      sourceName,
      sourceType: 'rss',
      publishedAt,
      discoveredAt,
      tags: [sourceName.toLowerCase().replace(/\s+/g, '-')],
      themes: classifyThemes(title, summary),
      qualitySignals,
      isOfficial: true,
      isRecent,
      isNoteworthy: noteworthy,
      status: suppressed ? 'suppressed' : 'active',
    };
  });
}
