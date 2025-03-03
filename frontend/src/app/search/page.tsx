'use client';

import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { SearchResults } from '@/components/search/SearchResults';
import Spinner from '@/components/ui/Spinner';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { isLoading, movies, error } = useSearch(query);

  if (isLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : 'Search Movies'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!query && (
        <div className="text-gray-600">
          Enter a search term to find movies.
        </div>
      )}
      
      {query && movies.length === 0 && !isLoading && (
        <div className="text-gray-600">
          No movies found matching "{query}".
        </div>
      )}
      
      <SearchResults movies={movies} />
    </div>
  );
} 