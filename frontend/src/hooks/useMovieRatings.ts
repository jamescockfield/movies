import { useState, useEffect } from 'react';
import { fetchMovieRatings, fetchMovieAverageRating, rateMovie, fetchMovieRatingsByUserId } from '@/services/api/ratings';
import { MovieRating } from '@/types/types';

interface UseMovieRatingsResult {
  ratings: MovieRating[];
  averageRating: number | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseUserRatingsResult {
  ratings: MovieRating[];
  isLoading: boolean;
  error: Error | null;
}

export const useMovieRatings = (movieId: string): UseMovieRatingsResult => {
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

export const useUserMovieRatings = (userId: string): UseUserRatingsResult => {
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const ratingsData = await fetchMovieRatingsByUserId(userId);
      setRatings(ratingsData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching user ratings:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  return { ratings, isLoading, error };
};

export const submitRating = async (movieId: string, rating: number) => {
  try {
    rateMovie(movieId, rating);
  } catch (err) {
    console.error('Error submitting rating:', err);
    throw err instanceof Error ? err : new Error('An unknown error occurred');
  }
};