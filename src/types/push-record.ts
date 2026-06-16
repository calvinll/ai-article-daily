import { z } from 'zod';

export const pushRecordSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  articleId: z.string().min(1),
  title: z.string().min(1),
  sourceName: z.string().min(1),
  channel: z.string().min(1),
  status: z.enum(['success', 'failed', 'skipped']),
  createdAt: z.string().datetime({ offset: true }),
});

export const pushRecordsSchema = z.array(pushRecordSchema);

export type PushRecord = z.infer<typeof pushRecordSchema>;
