# ai-article-daily

一个基于高质量 AI 来源做每日精选、推送和公开展示的项目。

## MVP 目标
- 接入 3~5 个高质量官方 AI 文章来源
- 统一归一化成 Article 模型
- 做每日推荐与去重
- 推送到飞书
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
- 归一化 / 评分 / 选择 / 推送骨架
- 飞书 adapter 骨架
- 历史记录骨架
- 网页展示骨架

## 推荐下一步
优先继续：
1. 接通 RSS 源抓取
2. 做 normalize + dedup
3. 跑通 preview / push 闭环
4. 再补网页归档
