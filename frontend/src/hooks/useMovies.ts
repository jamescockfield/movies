import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '@/services/api/movies';

export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: fetchMovies,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
}