# ai-article-daily

一个基于高质量 AI 来源做每日精选和公开展示的项目。

## MVP 目标
- 接入 3~5 个高质量官方 AI 文章来源
- 统一归一化成 Article 模型
- 做每日推荐与去重
- 提供一个公开可浏览的网页归档

## 推荐 source 类型
- RSS / Atom（第一版已优先接入）
- 官方 changelog / release notes（后续补强）
- 本地手工补充层

## 运行命令
```bash
npm install
npm run validate
npm run preview
npm run push
npm run web
npm run build:web
npm run build
npm test
```

## 当前状态
这是第一版项目骨架，已经包含：
- 文章数据模型
- source registry
- 归一化 / 评分 / 选择骨架
- 历史记录骨架
- 网页展示骨架
- 静态站构建骨架

## 网页展示
当前已支持：
- 首页推荐
- 历史归档页
- 文章详情页
- `npm run build:web` 生成 `dist-web/`

## GitHub Pages 部署
项目已提供：
- `.github/workflows/deploy-pages.yml`

在 GitHub 仓库中打开：
- `Settings -> Pages -> Build and deployment -> Source = GitHub Actions`

之后每次推到 `main` 或手动触发 workflow，都可以把 `dist-web/` 部署为公开站点。

## 推荐下一步
优先继续：
1. 增强文章质量与过滤规则
2. 优化网页样式与筛选体验
3. 推到 GitHub 并启用 GitHub Pages
