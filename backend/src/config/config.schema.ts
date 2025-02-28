import { z } from 'zod';

export const configSchema = z.object({
  database: z.object({
    uri: z.string().url(),
  }),
  jwt: z.object({
    secret: z.string().min(16),
    expiresIn: z.string()
  }),
  server: z.object({
    port: z.coerce.number(),
    host: z.string()
  }),
  tmdb: z.object({
    apiKey: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>; 