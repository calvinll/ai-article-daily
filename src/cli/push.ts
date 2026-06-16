import type { AppConfig } from '../types/app-config.js';
import { pushDailyArticles } from '../services/push.service.js';

export async function pushCommand(config: AppConfig): Promise<void> {
  const result = await pushDailyArticles(config);
  console.log(result.content.previewText);
  console.log(`\n推送结果：${result.pushResult.success ? 'success' : 'failed'}`);
}
