import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/types';
import { getCurrentUserProfile, getUserById as fetchUserById } from '@/services/api/users';

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch the current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const profile = await getCurrentUserProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to get a user profile by ID (can be used for other users)
  const getUserById = useCallback(async (userId: string): Promise<UserProfile> => {
    try {
      return await fetchUserById(userId);
    } catch (err) {
      console.error(`Error fetching user profile for ID: ${userId}`, err);
      throw err;
    }
  }, []);

  return { user, loading, error, getUserById };
} 