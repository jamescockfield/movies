import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/types';
import { getCurrentUserProfile, getUserById } from '@/services/api/users';

export function useUser(userId?: string) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = userId ? await getUserById(userId) : await getCurrentUserProfile();
        setUserProfile(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return { userProfile, isLoading, error };
}