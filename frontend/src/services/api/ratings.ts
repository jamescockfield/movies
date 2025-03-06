import { authService } from '@/services/api/AuthService';
import { MovieRating } from '@/types/types';

export const fetchMovieRatings = async (movieId: string): Promise<MovieRating[]> => {
  const url = `/movie-ratings/movie/${movieId}`;

  const response = await authService.fetchWithAuth(url);

  return response.json();
};

// TODO: consider storing the average rating in the movie object and remove this endpoint
export const fetchMovieAverageRating = async (movieId: string): Promise<{ averageRating: number }> => {
  const url = `/movie-ratings/movie/${movieId}/average`;
  
  const response = await authService.fetchWithAuth(url);

  return response.json();
};

export const fetchMovieRatingsByUserId = async (userId: string): Promise<MovieRating[]> => {
  const url = `/movie-ratings/user/${userId}`;
  
  const response = await authService.fetchWithAuth(url);

  return response.json();
};

export const rateMovie = async (movieId: string, rating: number): Promise<MovieRating> => {
  const url = `/movie-ratings/${movieId}`;
  
  const response = await authService.fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
  
  return response.json();
};