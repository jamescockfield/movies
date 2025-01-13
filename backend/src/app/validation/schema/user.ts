import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),
  email: z.string()
    .email()
    .max(255),
  password: z.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
  createdAt: z.date().default(() => new Date())
});

export type User = z.infer<typeof userSchema>;