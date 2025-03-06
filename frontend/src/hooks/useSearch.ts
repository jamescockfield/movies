import { Movie } from "@/types/types";
import { useFetch } from "./useFetch";
import { searchMovies } from "@/services/api/movies";

interface SearchResults {
  movies: Movie[];
}

export const useSearch = (query: string) => {
  const { data, isLoading, error } = useFetch<SearchResults, string>(
    searchMovies,
    query
  );

  return { 
    movies: data?.movies || [], 
    isLoading, 
    error: error ? error.message : null 
  };
}
