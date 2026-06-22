import { ArticleRepository } from '../repositories/article.repository.js';
import { HistoryRepository } from '../repositories/history.repository.js';
import { createDailyArticleContent } from './content.service.js';
import { deduplicateArticles } from './dedup.service.js';
import { normalizeArticles } from './normalize.service.js';
import { selectDailyArticles } from './selection.service.js';
import { fetchAllSources } from '../sources/source-registry.js';
import type { AppConfig } from '../types/app-config.js';
import type { PushRecord } from '../types/push-record.js';
import { getIsoTimestamp, getLocalDateKey } from '../utils/date.js';

export async function runDailyArticleFlow(config: AppConfig, options: { persistHistory?: boolean } = {}) {
  const articleRepository = new ArticleRepository(config.app.dataDir);
  const historyRepository = new HistoryRepository(config.app.dataDir);

  const seeds = await fetchAllSources(config);
  const normalized = normalizeArticles(seeds);
  const deduped = deduplicateArticles(normalized);
  await articleRepository.saveAll(deduped);

  const history = await historyRepository.getAll();
  const selected = selectDailyArticles(
    deduped,
    history,
    config.recommendation.maxDailyRecommendations,
    config.recommendation.daysToAvoidRepeat,
  );
  const content = createDailyArticleContent(selected);

  if (selected[0] && options.persistHistory !== false) {
    const record: PushRecord = {
      id: `${Date.now()}`,
      date: getLocalDateKey(new Date(), config.app.timezone),
      articleId: selected[0].id,
      title: selected[0].title,
      sourceName: selected[0].sourceName,
      channel: 'web',
      status: 'success',
      createdAt: getIsoTimestamp(),
    };
    await historyRepository.append(record);
  }

  return {
    selected,
    content,
    publishResult: {
      success: true,
      detail: { message: 'Web-first curation flow completed successfully.' },
    },
  };
}
