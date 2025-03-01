import { config } from '@/config/config';
import { authService } from '@/services/api/AuthService';
import { MovieRating } from '@/types/types';

export const fetchMovieRatings = async (movieId: string): Promise<MovieRating[]> => {
  const url = `${config.apiUrl}/movie-ratings/movie/${movieId}`;
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchMovieAverageRating = async (movieId: string): Promise<{ averageRating: number }> => {
  const url = `${config.apiUrl}/movie-ratings/movie/${movieId}/average`;
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const rateMovie = async (movieId: string, rating: number): Promise<MovieRating> => {
  const url = `${config.apiUrl}/movie-ratings/${movieId}`;
  
  const response = await authService.fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getUserRatings = async (): Promise<MovieRating[]> => {
  const url = `${config.apiUrl}/movie-ratings/user`;
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}; 