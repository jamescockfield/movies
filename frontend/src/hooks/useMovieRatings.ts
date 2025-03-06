import { useState, useEffect } from 'react';
import { fetchMovieRatings, fetchMovieAverageRating, rateMovie, fetchMovieRatingsByUserId } from '@/services/api/ratings';
import { MovieRating } from '@/types/types';
import { useFetch } from './useFetch';

// TODO: consider storing the average rating in the movie object and simplifying this hook
export const useMovieRatings = (movieId: string) => {
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ratingsData, averageData] = await Promise.all([
        fetchMovieRatings(movieId),
        fetchMovieAverageRating(movieId)
      ]);
      
      setRatings(ratingsData);
      setAverageRating(averageData.averageRating);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching movie ratings:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchData();
    }
  }, [movieId]);

  return { ratings, averageRating, isLoading, error };
}; 

export const useUserMovieRatings = (userId: string) => {
  const { data, isLoading, error } = useFetch<MovieRating[], string>(
    fetchMovieRatingsByUserId,
    userId
  );

  return { ratings: data || [], isLoading, error };
};

export const submitRating = async (movieId: string, rating: number) => {
  try {
    rateMovie(movieId, rating);
  } catch (err) {
    console.error('Error submitting rating:', err);
    throw err instanceof Error ? err : new Error('An unknown error occurred');
  }
};