import type { AppConfig } from '../types/app-config.js';
import { runDailyArticleFlow } from './daily-runner.service.js';

export async function pushDailyArticles(config: AppConfig) {
  return runDailyArticleFlow(config);
}
