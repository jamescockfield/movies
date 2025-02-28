import { useState, useEffect } from 'react';
import { fetchMovieById } from '@/services/api/movies';

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
  runtime?: number;
}

interface UseMovieResult {
  movie: Movie | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMovie = (movieId: number): UseMovieResult => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        const movieData = await fetchMovieById(movieId);
        setMovie(movieData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  return { movie, isLoading, error };
}; 