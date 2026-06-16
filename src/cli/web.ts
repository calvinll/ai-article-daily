import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { AppConfig } from '../types/app-config.js';

export async function webCommand(config: AppConfig): Promise<void> {
  const webDir = path.join(process.cwd(), 'web');
  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    const filePath = pathname === '/' ? path.join(webDir, 'index.html') : path.join(webDir, pathname.replace(/^\//, ''));
    try {
      const content = await readFile(filePath, 'utf8');
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

  await new Promise<void>((resolve) => server.listen(config.app.webPort, '0.0.0.0', () => resolve()));
  console.log(`web server listening on :${config.app.webPort}`);
}
