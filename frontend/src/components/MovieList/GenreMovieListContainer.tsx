'use client';

import { 
  Box, 
  Typography, 
} from '@mui/material';
import { useMoviesByGenre } from '@/hooks/useMoviesByGenre';
import MovieList from './MovieList';
import Spinner from '../ui/Spinner';
import { useEffect, useState } from 'react';

export default function MovieListGenres() {
  const { genres, moviesByGenre, isLoading, error } = useMoviesByGenre(24);
  const [readyLists, setReadyLists] = useState(new Set<string>());
  const [isAllListsReady, setIsAllListsReady] = useState(false);

  const handeListReady = (genreName: string) => {
    setReadyLists((prev: Set<string>) => {
      const newSet = new Set(prev);
      newSet.add(genreName);
      return newSet;
    });
  }

  useEffect(() => {
    if (readyLists.size === genres.length) {
      setIsAllListsReady(true);
    }
  }, [genres, readyLists]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Typography color="error">Failed to load movies: {error.message}</Typography>;
  }

  return (
    <Box className="max-w-full mx-auto p-2">
      {genres.map((genre) => {
        const moviesInGenre = moviesByGenre[genre.name] || [];
        
        // Skip genres with no movies
        if (moviesInGenre.length === 0) return null;
        
        return (
          <Box key={genre.id} className="mb-4">
            <Typography variant="h5" sx={{ margin: '5px 0 5px 0' }}>
              {genre.name}
            </Typography>
            <MovieList shouldDisplay={isAllListsReady} genreName={genre.name} movies={moviesInGenre} onReady={() => handeListReady(genre.name)} />
          </Box>
        );
      })}
    </Box>
  );
} 