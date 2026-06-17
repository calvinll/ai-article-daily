import { createHash } from 'node:crypto';

export function createStableId(value: string, prefix: string): string {
  const digest = createHash('sha256').update(value).digest('hex').slice(0, 12);
  return `${prefix}-${digest}`;
}
