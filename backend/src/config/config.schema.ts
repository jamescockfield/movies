import { z } from 'zod';

export const configSchema = z.object({
  database: z.object({
    uri: z.string().url(),
  }),
  jwt: z.object({
    secret: z.string().min(16),
    expiresIn: z.string().default('1d'),
  }),
  server: z.object({
    port: z.coerce.number().default(3000),
    host: z.string().default('0.0.0.0'),
  }),
  tmdb: z.object({
    apiKey: z.string(),
  }),
});

export type Config = z.infer<typeof configSchema>; 