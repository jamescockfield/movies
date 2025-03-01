'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/types';
import { getCurrentUserProfile } from '@/services/api/users';

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load account data');
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router]);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Account Settings</h1>
        
        {profile && (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">Username:</span>
                <span>{profile.username}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">User ID:</span>
                <span className="text-sm text-gray-600">{profile._id}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-500">Role:</span>
                <span>{profile.isAdmin ? 'Administrator' : 'User'}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <button 
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
} 