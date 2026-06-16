import cron from 'node-cron';

import type { AppConfig } from '../types/app-config.js';

export async function validateCommand(config: AppConfig): Promise<void> {
  if (!cron.validate(config.schedule.dailyPushCron)) {
    throw new Error(`Invalid DAILY_PUSH_CRON: ${config.schedule.dailyPushCron}`);
  }
  console.log('Validation passed.');
}
