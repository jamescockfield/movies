'use client';

import { 
  Box, 
  Typography, 
  Divider
} from '@mui/material';
import { useMoviesByGenre } from '@/hooks/useMoviesByGenre';
import MovieList from './MovieList';
import Spinner from '../ui/Spinner';

export default function MovieListGenres() {
  const { genres, moviesByGenre, isLoading, error } = useMoviesByGenre(6);

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
            <Typography variant="h5" className="mb-2 mt-4">
              {genre.name}
            </Typography>
            <Divider className="mb-2" />
            
            <MovieList genreName={genre.name} movies={moviesInGenre} />
          </Box>
        );
      })}
    </Box>
  );
} 