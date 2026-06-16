import type { AppConfig } from '../types/app-config.js';
import { runDailyArticleFlow } from '../services/daily-runner.service.js';

export async function previewCommand(config: AppConfig): Promise<void> {
  const result = await runDailyArticleFlow({
    ...config,
    channels: {
      ...config.channels,
      feishu: {
        ...config.channels.feishu,
        enabled: false,
      },
    },
  });

  console.log(result.content.previewText);
}
