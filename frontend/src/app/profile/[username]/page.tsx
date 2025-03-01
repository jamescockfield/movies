'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authService } from '@/services/api/AuthService';
import { MovieRating } from '@/types/types';

interface UserPublicProfile {
  username: string;
  ratings: MovieRating[];
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // This would be replaced with an actual API call to get public profile data
        // For now, we'll simulate it with a timeout
        setTimeout(() => {
          setProfile({
            username: username,
            ratings: [
              {
                id: '1',
                movieId: 1,
                movieTitle: 'The Shawshank Redemption',
                rating: 5,
                comment: 'One of the best movies ever made!',
                createdAt: new Date().toISOString(),
              },
              {
                id: '2',
                movieId: 2,
                movieTitle: 'The Godfather',
                rating: 4,
                comment: 'A classic masterpiece',
                createdAt: new Date().toISOString(),
              },
              {
                id: '3',
                movieId: 3,
                movieTitle: 'The Dark Knight',
                rating: 5,
                createdAt: new Date().toISOString(),
              },
            ],
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
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
            <div className="grid grid-cols-1 gap-4">
              {profile?.ratings.map((rating) => (
                <div key={rating.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{rating.movieTitle}</h3>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold">{rating.rating}/5</span>
                    </div>
                  </div>
                  
                  {rating.comment && (
                    <p className="text-gray-700 mb-2">{rating.comment}</p>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
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