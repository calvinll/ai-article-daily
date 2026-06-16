import path from 'node:path';

import type { AppConfig } from '../types/app-config.js';
import type { EnvConfig } from './schema.js';

export function createAppConfig(env: EnvConfig, cwd: string = process.cwd()): AppConfig {
  return {
    app: {
      env: env.APP_ENV,
      timezone: env.APP_TIMEZONE,
      dataDir: path.resolve(cwd, env.DATA_DIR),
      webPort: env.WEB_PORT,
    },
    schedule: {
      dailyPushCron: env.DAILY_PUSH_CRON,
    },
    recommendation: {
      daysToAvoidRepeat: env.DAYS_TO_AVOID_REPEAT,
      maxDailyRecommendations: env.MAX_DAILY_RECOMMENDATIONS,
    },
    sources: {
      openaiRss: env.ARTICLE_SOURCE_OPENAI_RSS,
      huggingFaceRss: env.ARTICLE_SOURCE_HF_RSS,
      googleAiRss: env.ARTICLE_SOURCE_GOOGLE_AI_RSS,
    },
  };
}
