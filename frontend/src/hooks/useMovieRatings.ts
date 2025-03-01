import { useState, useEffect } from 'react';
import { fetchMovieRatings, fetchMovieAverageRating, rateMovie, getUserRatingsByUserId } from '@/services/api/ratings';
import { MovieRating } from '@/types/types';

interface UseMovieRatingsResult {
  ratings: MovieRating[];
  averageRating: number | null;
  isLoading: boolean;
  error: Error | null;
  submitRating: (rating: number) => Promise<void>;
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

  const submitRating = async (rating: number) => {
    try {
      await rateMovie(movieId, rating);
      // Refresh ratings after submission
      fetchData();
    } catch (err) {
      console.error('Error submitting rating:', err);
      throw err instanceof Error ? err : new Error('An unknown error occurred');
    }
  };

  return { ratings, averageRating, isLoading, error, submitRating };
}; 

export const useUserRatings = (userId: string): UseUserRatingsResult => {
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const ratingsData = await getUserRatingsByUserId(userId);
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

