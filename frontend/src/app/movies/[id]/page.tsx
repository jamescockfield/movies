'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMovie } from '@/hooks/useMovie';
import { useMovieRatings } from '@/hooks/useMovieRatings';
import { Genre, MovieRating } from '@/types/types';
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
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import { fetchGenres } from '@/services/api/genres';
import { Person as PersonIcon, Star as StarIcon } from '@mui/icons-material';

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const { movie, isLoading: isMovieLoading, error: movieError } = useMovie(params.id as string);
  const { 
    ratings, 
    averageRating, 
    isLoading: isRatingsLoading, 
    error: ratingsError, 
    submitRating 
  } = useMovieRatings(params.id as string);
  
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

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

  const handleRatingSubmit = async () => {
    if (userRating) {
      try {
        await submitRating(userRating);
        setOpenRatingDialog(false);
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
  };

  if (!isAuthChecked) {
    return null;
  }

  const isLoading = isMovieLoading || isRatingsLoading;
  const error = movieError || ratingsError;

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
            
            {/* Display average rating from our hook instead of TMDB rating */}
            {averageRating !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {averageRating.toFixed(1)}/5 ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setOpenRatingDialog(true)}
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
        {ratings.length > 0 ? (
          <List>
            {ratings.map((rating: MovieRating) => (
              <ListItem key={rating.id} alignItems="flex-start" divider>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={rating.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                  secondary={rating.comment || "No comment provided"}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No ratings yet. Be the first to rate this movie!
          </Typography>
        )}
      </Paper>

      {/* Rating Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)}>
        <DialogTitle>Rate this movie</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
            <Typography variant="body1" gutterBottom>
              How would you rate "{movie.title}"?
            </Typography>
            <Rating
              name="movie-rating"
              value={userRating}
              onChange={(_, newValue) => setUserRating(newValue)}
              precision={0.5}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRatingSubmit} 
            color="primary" 
            disabled={!userRating}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 