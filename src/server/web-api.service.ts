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

  async getRawArticles() {
    return this.articleRepository.getAll();
  }

  async getToday() {
    const [articles, history] = await Promise.all([
      this.articleRepository.getAll(),
      this.historyRepository.getAll(),
    ]);
    const { selectDailyArticles } = await import('../services/selection.service.js');
    const selected = selectDailyArticles(
      articles,
      history,
      this.config.recommendation.maxDailyRecommendations,
      this.config.recommendation.daysToAvoidRepeat,
    );
    return buildTodayArticle(selected[0] ?? articles[0]);
  }

  async getArticles() {
    const articles = await this.articleRepository.getAll();
    return buildArticleSummaries(articles);
  }

  async getArticleDetail(id: string) {
    const details = buildArticleDetails(await this.articleRepository.getAll());
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
