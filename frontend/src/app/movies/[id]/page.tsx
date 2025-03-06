'use client';

import BackToHome from '@/components/ui/BackToHome';
import RatingDialog from '@/components/movieDetails/RatingDialog';
import UserRatings from '@/components/movieDetails/UserRatings';
import { useGenres } from '@/hooks/useGenres';
import { useMovie } from '@/hooks/useMovie';
import { useMovieRatings } from '@/hooks/useMovieRatings';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Rating,
  Typography
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import MoviePoster from '@/components/ui/MoviePoster';

export default function MovieDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { movie, isLoading: isMovieLoading, error: movieError } = useMovie(params.id as string);
  const { 
    ratings, 
    averageRating, 
    isLoading: isRatingsLoading, 
    error: ratingsError
  } = useMovieRatings(params.id as string);

  const [openRatingDialog, setOpenRatingDialog] = useState(false);

  const { genres, isLoading: isGenresLoading, error: genresError } = useGenres();

  const isLoading = isMovieLoading || isRatingsLoading || isGenresLoading;
  const error = movieError || ratingsError || genresError;

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <BackToHome error={`Error loading movie: ${error.message}`} />;
  }

  if (!movie) {
    return <BackToHome error="Movie not found" />;
  }

  return (
    <Container maxWidth="lg" className="mt-4 mb-8">
      <Button 
        variant="outlined" 
        onClick={() => router.back()}
      >
        Back
      </Button>
      
      <Paper elevation={3} className="p-3 my-4">
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Box className="text-center">
              <MoviePoster movie={movie} />
            </Box>
          </Grid>
          
          {/* Movie Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box className="flex items-center mb-2">
              <Chip 
                label={genres.find(genre => genre.id === movie.genreId)?.name} 
                color="primary" 
                size="small" 
                className="mr-1" 
              />
              
              {movie.release_date && (
                <Typography variant="body2" color="text.secondary" className="mr-2">
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary">
                2h 10m { /* TODO: fetch runtime from TMDB when seeding */ }
              </Typography>
            </Box>
            
            {averageRating !== null && (
              <Box className="flex items-center mb-3" >
                <Rating 
                  value={averageRating} 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="body2" className="ml-1">
                  {averageRating.toFixed(1)}/5 ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>
            
            <Box className="mt-4">
              <Button 
                variant="contained" 
                color="primary"
                className="mr-2"
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
      
      <UserRatings movieId={params.id as string} />

      { /* TODO: refactor to avoid passing openRatingDialog and setOpenRatingDialog as props */}
      <RatingDialog movie={movie} openRatingDialog={openRatingDialog} setOpenRatingDialog={setOpenRatingDialog} />
    </Container>
  );
} 