import path from 'node:path';

import { pushRecordsSchema, type PushRecord } from '../types/push-record.js';
import { readJsonFileIfExists, writeJsonFile } from '../utils/file.js';

export class HistoryRepository {
  constructor(private readonly dataDir: string) {}

  private get filePath(): string {
    return path.join(this.dataDir, 'push-history.json');
  }

  async getAll(): Promise<PushRecord[]> {
    const raw = await readJsonFileIfExists<unknown[]>(this.filePath, []);
    return pushRecordsSchema.parse(raw);
  }

  async append(record: PushRecord): Promise<void> {
    const existing = await this.getAll();
    existing.push(record);
    await writeJsonFile(this.filePath, existing);
  }
}
