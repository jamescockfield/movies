import { Movie } from "@/types/types";
import { useState, useEffect } from "react";
import { searchMovies } from "@/services/api/movies";

export const useSearch = (query: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const results = await searchMovies(query);
        setMovies(results.movies);
        setIsLoading(false);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results');
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

  return { isLoading, movies, error };
}
