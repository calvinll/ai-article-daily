import type { AppConfig } from '../types/app-config.js';
import { runDailyArticleFlow } from '../services/daily-runner.service.js';

export async function previewCommand(config: AppConfig): Promise<void> {
  const result = await runDailyArticleFlow(config);
  console.log(result.content.previewText);
}
