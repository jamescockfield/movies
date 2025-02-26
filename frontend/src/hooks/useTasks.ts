import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/services/api/tasks';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
}