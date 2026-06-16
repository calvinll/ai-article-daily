import { fetchRssSource } from './rss.source.js';
import type { ArticleSeed } from './types.js';
import type { AppConfig } from '../types/app-config.js';

export async function fetchAllSources(config: AppConfig): Promise<ArticleSeed[]> {
  const sources = await Promise.all([
    fetchRssSource(config.sources.openaiRss, 'OpenAI'),
    fetchRssSource(config.sources.huggingFaceRss, 'Hugging Face'),
    fetchRssSource(config.sources.googleAiRss, 'Google AI'),
  ]);

  return sources.flat();
}
