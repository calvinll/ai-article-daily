import { z } from 'zod';

export const articleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  canonicalUrl: z.string().url(),
  sourceName: z.string().min(1),
  sourceType: z.enum(['rss', 'changelog', 'manual']),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  discoveredAt: z.string().datetime({ offset: true }),
  tags: z.array(z.string().min(1)).default([]),
  themes: z.array(z.string().min(1)).min(1),
  qualitySignals: z.array(z.string().min(1)).default([]),
  isOfficial: z.boolean().default(false),
  isRecent: z.boolean().default(false),
  isNoteworthy: z.boolean().default(false),
  editorScore: z.number().min(0).max(100).default(80),
  whyRecommended: z.string().min(1),
  status: z.enum(['active', 'suppressed']).default('active'),
});

export const articlesSchema = z.array(articleSchema);

export type Article = z.infer<typeof articleSchema>;
