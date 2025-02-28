'use client';

import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  Box,
  Grid,
  CardActionArea
} from '@mui/material';

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  poster_path: string;
}

interface MovieListProps {
  genreName: string;
  movies: Movie[];
}

export default function MovieList({ genreName, movies }: MovieListProps) {
  const router = useRouter();

  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  return (
    <Grid container spacing={2}>
      {movies.map((movie: Movie) => (
        <Grid item key={movie.id} xs={12} sm={6} md={3} lg={1.5}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <CardActionArea 
              onClick={() => handleMovieClick(movie.id)}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" noWrap>{movie.title}</Typography>
                <Chip 
                  label={genreName} 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1, mb: 1, alignSelf: 'flex-start' }} 
                />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1
                  }}
                >
                  {movie.description}
                </Typography>
                <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                    alt={movie.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}