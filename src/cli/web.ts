import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { buildStaticSite } from '../server/static-site.service.js';
import type { AppConfig } from '../types/app-config.js';

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function getContentType(filePath: string): string {
  return CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
}

function resolveRequestPath(distDir: string, requestPath: string): string {
  const pathname = requestPath === '/' ? '/index.html' : requestPath;
  const normalized = pathname.replace(/^\/+/, '');
  const filePath = path.resolve(distDir, normalized);

  if (!filePath.startsWith(path.resolve(distDir))) {
    throw new Error('Invalid path');
  }

  return filePath;
}

export function createWebServer(distDir: string): Server {
  return createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
      const filePath = resolveRequestPath(distDir, pathname);
      const content = await readFile(filePath);
      res.setHeader('content-type', getContentType(filePath));
      res.end(content);
    } catch (error) {
      res.statusCode = error instanceof Error && error.message === 'Invalid path' ? 400 : 404;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end(res.statusCode === 400 ? 'Bad request' : 'Not found');
    }
  });
}

export async function webCommand(config: AppConfig): Promise<void> {
  const distDir = await buildStaticSite(config);
  const server = createWebServer(distDir);

  await new Promise<void>((resolve) => server.listen(config.app.webPort, '0.0.0.0', () => resolve()));
  console.log(`web preview built and listening on :${config.app.webPort}`);
}
