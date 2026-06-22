import type { AppConfig } from '../types/app-config.js';
import { fetchChangelogSource } from './changelog.source.js';
import { fetchRssSource } from './rss.source.js';
import type { ArticleSeed } from './types.js';

type SourceLoader = {
  label: string;
  load: () => Promise<ArticleSeed[]>;
};

async function settleSource(loader: SourceLoader): Promise<ArticleSeed[]> {
  try {
    return await loader.load();
  } catch (error) {
    console.warn(`Skipped source ${loader.label}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

export async function fetchAllSources(config: AppConfig): Promise<ArticleSeed[]> {
  const sources: SourceLoader[] = [
    {
      label: 'OpenAI RSS',
      load: () => fetchRssSource(config.sources.openaiRss, 'OpenAI'),
    },
    {
      label: 'Hugging Face RSS',
      load: () => fetchRssSource(config.sources.huggingFaceRss, 'Hugging Face'),
    },
    {
      label: 'Google AI RSS',
      load: () => fetchRssSource(config.sources.googleAiRss, 'Google AI'),
    },
  ];

  if (config.sources.openaiChangelog) {
    sources.push({
      label: 'OpenAI Changelog',
      load: () => fetchChangelogSource(config.sources.openaiChangelog as string, 'OpenAI Changelog'),
    });
  }

  if (config.sources.anthropicReleaseNotes) {
    sources.push({
      label: 'Anthropic Release Notes',
      load: () => fetchChangelogSource(config.sources.anthropicReleaseNotes as string, 'Anthropic Release Notes'),
    });
  }

  if (config.sources.vercelAiSdkChangelog) {
    sources.push({
      label: 'Vercel AI SDK Changelog',
      load: () => fetchChangelogSource(config.sources.vercelAiSdkChangelog as string, 'Vercel AI SDK Changelog'),
    });
  }

  const results = await Promise.all(sources.map((source) => settleSource(source)));
  return results.flat();
}
