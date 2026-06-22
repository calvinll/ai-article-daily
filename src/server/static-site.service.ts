import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { AppConfig } from '../types/app-config.js';
import { buildArticleDetails } from './view-models.js';
import { WebApiService } from './web-api.service.js';

async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

async function copyDir(sourceDir: string, targetDir: string): Promise<void> {
  await ensureDir(targetDir);
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) await copyDir(sourcePath, targetPath);
    else await copyFile(sourcePath, targetPath);
  }
}

export async function buildStaticSite(config: AppConfig): Promise<string> {
  const api = new WebApiService(config);
  const root = process.cwd();
  const webDir = path.join(root, 'web');
  const distDir = path.join(root, 'dist-web');
  const dataDir = path.join(distDir, 'data');
  const assetsDir = path.join(distDir, 'assets');

  await ensureDir(distDir);
  await ensureDir(dataDir);
  await ensureDir(assetsDir);
  await copyDir(path.join(webDir, 'assets'), assetsDir);

  const [today, articles, history] = await Promise.all([
    api.getToday(),
    api.getArticles(),
    api.getHistory(),
  ]);

  const articleDetails = buildArticleDetails(await api.getRawArticles()).map((detail) => ({
    id: detail.id,
    detail,
  }));

  await writeFile(path.join(dataDir, 'today.json'), `${JSON.stringify(today, null, 2)}\n`, 'utf8');
  await writeFile(path.join(dataDir, 'articles.json'), `${JSON.stringify(articles, null, 2)}\n`, 'utf8');
  await writeFile(path.join(dataDir, 'history.json'), `${JSON.stringify(history, null, 2)}\n`, 'utf8');
  await writeFile(path.join(dataDir, 'article-details.json'), `${JSON.stringify(articleDetails, null, 2)}\n`, 'utf8');

  for (const page of ['index.html', 'archive.html', 'article.html']) {
    const html = await readFile(path.join(webDir, page), 'utf8');
    await writeFile(path.join(distDir, page), html, 'utf8');
  }

  return distDir;
}
