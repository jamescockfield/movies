import { useState, useEffect } from 'react';
import { fetchMoviesByGenreIds } from '@/services/api/movies';
import { fetchGenres } from '@/services/api/genres';
import { Movie, Genre, MoviesByGenre } from '@/types/types';


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
        const moviesData = await fetchMoviesByGenreIds(genreIds, moviesPerGenre);
        
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