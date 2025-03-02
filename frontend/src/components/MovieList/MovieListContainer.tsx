'use client';

import { 
  Box, 
  Typography, 
  CircularProgress,
  Divider
} from '@mui/material';
import { useMoviesByGenre } from '@/hooks/useMoviesByGenre';
import MovieList from './MovieList';

export default function MovieListContainer() {
  const { genres, moviesByGenre, isLoading, error } = useMoviesByGenre(6);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load movies: {error.message}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto', padding: 2 }}>
      {genres.map((genre) => {
        const moviesInGenre = moviesByGenre[genre.name] || [];
        
        // Skip genres with no movies
        if (moviesInGenre.length === 0) return null;
        
        return (
          <Box key={genre.id} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
              {genre.name}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <MovieList 
              genreName={genre.name} 
              movies={moviesInGenre} 
            />
          </Box>
        );
      })}
    </Box>
  );
} 