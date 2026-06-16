import { z } from 'zod';

const optionalNonEmptyString = z.preprocess((value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}, z.string().min(1).optional());

export const envSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_TIMEZONE: z.string().min(1).default('Asia/Shanghai'),
  WEB_PORT: z.coerce.number().int().min(1).default(4273),
  DATA_DIR: z.string().min(1).default('./data'),
  DAILY_PUSH_CRON: z.string().min(1).default('5 9 * * *'),
  FEISHU_ENABLED: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  FEISHU_WEBHOOK_URL: z.string().url().default('https://open.feishu.cn/open-apis/bot/v2/hook/replace-me'),
  FEISHU_BOT_SECRET: optionalNonEmptyString,
  FEISHU_REQUIRED_KEYWORD: optionalNonEmptyString,
  DAYS_TO_AVOID_REPEAT: z.coerce.number().int().min(0).default(7),
  MAX_DAILY_RECOMMENDATIONS: z.coerce.number().int().min(1).max(5).default(3),
  ARTICLE_SOURCE_OPENAI_RSS: z.string().url(),
  ARTICLE_SOURCE_HF_RSS: z.string().url(),
  ARTICLE_SOURCE_GOOGLE_AI_RSS: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;
