import { useState, useEffect } from 'react';
import { fetchMovies } from '@/services/api/movies';
import { fetchGenres } from '@/services/api/genres';

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  poster_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface MoviesByGenre {
  genres: Genre[];
  moviesByGenre: Record<string, Movie[]>;
  isLoading: boolean;
  error: Error | null;
}

export const useMoviesByGenre = (moviesPerGenre: number = 8): MoviesByGenre => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<Record<string, Movie[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch genres first
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
        
        // Extract genre IDs for the movies request
        const genreIds = fetchedGenres.map((genre: Genre) => genre.id);
        
        // Fetch movies filtered by genres with the specified amount per genre
        const moviesData = await fetchMovies(genreIds, moviesPerGenre);
        
        // Set the movies by genre from the response
        setMoviesByGenre(moviesData.moviesByGenre);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching movies by genre:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [moviesPerGenre]);

  return { genres, moviesByGenre, isLoading, error };
}; 