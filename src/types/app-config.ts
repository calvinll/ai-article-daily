export type AppConfig = {
  app: {
    env: 'development' | 'production' | 'test';
    timezone: string;
    dataDir: string;
    webPort: number;
  };
  schedule: {
    dailyPushCron: string;
  };
  recommendation: {
    daysToAvoidRepeat: number;
    maxDailyRecommendations: number;
  };
  channels: {
    feishu: {
      enabled: boolean;
      webhookUrl: string;
      botSecret?: string;
      requiredKeyword?: string;
    };
  };
  sources: {
    openaiRss: string;
    huggingFaceRss: string;
    googleAiRss: string;
  };
};
