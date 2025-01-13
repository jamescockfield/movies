import { z } from 'zod';

export const movieRatingSchema = z.object({
  movieId: z.number().int().positive(),
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
  userId: z.number().int().positive()
});

export type MovieRating = z.infer<typeof movieRatingSchema>;