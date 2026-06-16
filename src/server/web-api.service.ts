import type { AppConfig } from '../types/app-config.js';
import { ArticleRepository } from '../repositories/article.repository.js';
import { HistoryRepository } from '../repositories/history.repository.js';
import { buildArticleDetails, buildArticleSummaries, buildHistoryItems, buildTodayArticle } from './view-models.js';

export class WebApiService {
  private readonly articleRepository: ArticleRepository;
  private readonly historyRepository: HistoryRepository;

  constructor(private readonly config: AppConfig) {
    this.articleRepository = new ArticleRepository(config.app.dataDir);
    this.historyRepository = new HistoryRepository(config.app.dataDir);
  }

  async getToday() {
    const articles = await this.articleRepository.getAll();
    return buildTodayArticle(articles[0]);
  }

  async getArticles() {
    const articles = await this.articleRepository.getAll();
    return buildArticleSummaries(articles);
  }

  async getArticleDetail(id: string) {
    const articles = await this.articleRepository.getAll();
    const details = buildArticleDetails(articles);
    return details.find((article) => article.id === id) ?? null;
  }

  async getHistory() {
    const [articles, history] = await Promise.all([
      this.articleRepository.getAll(),
      this.historyRepository.getAll(),
    ]);
    return buildHistoryItems(history, articles);
  }
}
