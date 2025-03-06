import { useState, useEffect } from 'react';

type FetchFunction<T, P> = (params: P) => Promise<T>;

export interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * A generic hook for data fetching with loading and error states
 * 
 * @param fetchFn The function that performs the actual API call
 * @param params Parameters to pass to the fetch function
 * @param dependencies Optional additional dependencies for the useEffect. If not provided, params will be used as dependencies.
 * @returns Object containing data, loading state, and error
 */
export function useFetch<T, P = void>(
  fetchFn: FetchFunction<T, P>,
  params: P,
  dependencies?: React.DependencyList
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // If dependencies are not provided, use params as dependencies
  // For primitive params, this works well
  // For object params, we need to be careful about reference equality
  const deps = dependencies || (typeof params === 'object' ? [JSON.stringify(params)] : [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchFn(params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFn, ...deps]);

  return { data, isLoading, error };
} 