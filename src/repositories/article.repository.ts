import path from 'node:path';

import { articlesSchema, type Article } from '../types/article.js';
import { readJsonFileIfExists, writeJsonFile } from '../utils/file.js';

export class ArticleRepository {
  constructor(private readonly dataDir: string) {}

  private get filePath(): string {
    return path.join(this.dataDir, 'articles.json');
  }

  async getAll(): Promise<Article[]> {
    const raw = await readJsonFileIfExists<unknown[]>(this.filePath, []);
    return articlesSchema.parse(raw);
  }

  async saveAll(articles: Article[]): Promise<void> {
    await writeJsonFile(this.filePath, articles);
  }
}
