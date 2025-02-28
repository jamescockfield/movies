'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Movie {
  id: number;
  title: string;
  posterPath: string;
  releaseDate: string;
  overview: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!query) {
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        // This would be replaced with an actual API call
        // For now, we'll simulate it with a timeout
        setTimeout(() => {
          setMovies([
            {
              id: 1,
              title: 'The Shawshank Redemption',
              posterPath: '/placeholder.jpg',
              releaseDate: '1994-09-23',
              overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            },
            {
              id: 2,
              title: 'The Godfather',
              posterPath: '/placeholder.jpg',
              releaseDate: '1972-03-24',
              overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            },
            {
              id: 3,
              title: 'The Dark Knight',
              posterPath: '/placeholder.jpg',
              releaseDate: '2008-07-18',
              overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            },
          ].filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase())
          ));
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load search results');
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map(movie => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Movie Poster</span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Released: {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3">{movie.overview}</p>
              <button 
                onClick={() => router.push(`/movies/${movie.id}`)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 