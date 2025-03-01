'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMovie } from '@/hooks/useMovie';
import { Genre } from '@/types/types';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container, 
  Grid, 
  Paper, 
  Chip,
  Button,
  Rating,
  Divider
} from '@mui/material';
import { fetchGenres } from '@/services/api/genres';

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const { movie, isLoading, error } = useMovie(params.id as string);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    getGenres();
  }, []);

  if (!isAuthChecked) {
    return null;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Error loading movie: {error.message}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">
          Movie not found
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Button 
        variant="outlined" 
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </Grid>
          
          {/* Movie Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={genres.find(genre => genre.id === movie.genreId)?.name} 
                color="primary" 
                size="small" 
                sx={{ mr: 1 }} 
              />
              
              {movie.release_date && (
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary">
                2h 10m
              </Typography>
            </Box>
            
            {movie.vote_average && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={movie.vote_average / 2} 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {movie.vote_average.toFixed(1)}/10
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mr: 2 }}
              >
                Add Rating
              </Button>
              <Button variant="outlined">
                Add to Watchlist
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 2 }}>
        User Ratings
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No ratings yet. Be the first to rate this movie!
        </Typography>
      </Paper>
    </Container>
  );
} 