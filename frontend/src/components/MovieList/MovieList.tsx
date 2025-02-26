'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import { useMovies } from '@/hooks/useMovies';
  
interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
}

export default function MovieList() {
  const { data: movies, isLoading, error } = useMovies();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Failed to load movies</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Movies
      </Typography>
      <List>
        {movies?.map((movie: Movie) => (
          <ListItem key={movie.id}>
              <Card sx={{ width: '100%', mb: 1 }}>
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Chip label={movie.genre} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {movie.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}