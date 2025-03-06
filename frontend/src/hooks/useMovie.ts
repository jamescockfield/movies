import { useFetch } from './useFetch';
import { fetchMovieById } from '@/services/api/movies';
import { Movie } from '@/types/types';

interface UseMovieResult {
  movie: Movie | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMovie = (movieId: string): UseMovieResult => {
  const { data, isLoading, error } = useFetch<Movie, string>(
    fetchMovieById,
    movieId
  );

  return { movie: data, isLoading, error };
}; 