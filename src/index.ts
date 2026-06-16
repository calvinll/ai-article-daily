import { Command } from 'commander';
import process from 'node:process';

import { createAppConfig } from './config/app-config.js';
import { loadEnv } from './config/env.js';
import { buildWebCommand } from './cli/build-web.js';
import { previewCommand } from './cli/preview.js';
import { validateCommand } from './cli/validate.js';
import { webCommand } from './cli/web.js';

async function main(): Promise<void> {
  const env = loadEnv();
  const config = createAppConfig(env);
  const program = new Command();

  program.name('ai-article-daily').description('Daily AI article curation and push project');

  program.command('preview').action(async () => previewCommand(config));
  program.command('validate').action(async () => validateCommand(config));
  program.command('build-web').action(async () => buildWebCommand(config));
  program.command('web').action(async () => webCommand(config));

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
