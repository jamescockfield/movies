'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MovieRating, UserProfile } from '@/types/types';
import { useUserRatings } from '@/hooks/useMovieRatings';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

interface UserPublicProfile {
  username: string;
  ratings: MovieRating[];
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { getUserById } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { ratings, isLoading: ratingsLoading, error: ratingsError } = useUserRatings(userId);
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // Use the getUserById function from the useUser hook
        const userData = await getUserById(userId);
        setUserProfile(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, getUserById]);

  // Set profile when both user data and ratings are loaded
  useEffect(() => {
    if (userProfile && ratings) {
      setProfile({ 
        username: userProfile.username, 
        ratings 
      });
    }
  }, [userProfile, ratings]);

  if (isLoading || ratingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || ratingsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{(error || ratingsError)?.message}</div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
            {profile?.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold mb-2">{profile?.username}'s Profile</h1>
            <p className="text-gray-600 mb-4">Movie enthusiast</p>
            <div className="flex gap-2">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                <span className="font-bold">{profile?.ratings.length || 0}</span> ratings
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Movie Ratings</h2>
          
          {profile?.ratings.length === 0 ? (
            <p className="text-gray-500">No ratings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile?.ratings.map((rating) => (
                <div key={rating._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
                  {/* Movie Thumbnail */}
                  <div className="h-48 bg-gray-200 relative">
                    {rating.movieId.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${rating.movieId.poster_path}`} 
                        alt={rating.movieId.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex items-center bg-yellow-100 px-2 py-1 rounded shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold">{rating.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">
                      <a 
                        href={`/movies/${rating.movieId._id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {rating.movieId.title}
                      </a>
                    </h3>
                    
                    {rating.comment && (
                      <p className="text-gray-700 mb-2">{rating.comment}</p>
                    )}
                    
                    <div className="text-sm text-gray-500 mt-auto">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 