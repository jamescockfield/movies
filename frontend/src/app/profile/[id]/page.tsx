'use client';

import { useParams } from 'next/navigation';
import { useUserMovieRatings } from '@/hooks/useMovieRatings';
import { useUser } from '@/hooks/useUser';
import BackToHome from '@/components/ui/BackToHome';
import UserMovieRatingList from '@/components/profile/UserMovieRatingList';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const { ratings, isLoading: ratingsLoading, error: ratingsError } = useUserMovieRatings(userId);
  const { userProfile: profile, isLoading: userLoading, error: userError } = useUser(userId);

  if (userLoading || ratingsLoading) {
    return (
      <Spinner />
    );
  }

  if (userError || ratingsError) {
    return (
      <BackToHome error={(userError || ratingsError)?.message} />
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start w-full max-w-4xl gap-8 mb-10">
        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
          {profile?.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl font-bold mb-2">{profile?.username}'s Profile</h1>
          <p className="text-gray-600 mb-4">Movie enthusiast</p>
          <div className="flex gap-2">
            <div className="bg-green-700 px-3 py-1 rounded-full text-sm">
              <span className="font-bold">{ratings.length || 0}</span> ratings
            </div>
          </div>
        </div>
      </div>

      <UserMovieRatingList userId={userId} ratings={ratings} />

      <BackToHome />
    </div>
  );
} 