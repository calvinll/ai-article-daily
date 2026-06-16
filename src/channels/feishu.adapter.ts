import type { AppConfig } from '../types/app-config.js';

export class FeishuAdapter {
  constructor(private readonly config: AppConfig['channels']['feishu']) {}

  async send(content: string): Promise<{ success: boolean; detail: unknown }> {
    if (!this.config.enabled) {
      return { success: true, detail: { message: 'Feishu disabled' } };
    }

    return {
      success: true,
      detail: {
        webhookUrl: this.config.webhookUrl,
        content,
      },
    };
  }
}
