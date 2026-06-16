import cron from 'node-cron';

import type { AppConfig } from '../types/app-config.js';
import { pushDailyArticles } from '../services/push.service.js';

export async function scheduleCommand(config: AppConfig): Promise<void> {
  cron.schedule(config.schedule.dailyPushCron, async () => {
    await pushDailyArticles(config);
  }, { timezone: config.app.timezone });
  console.log('daily article scheduler started');
}
