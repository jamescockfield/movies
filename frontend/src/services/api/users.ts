import { config } from '@/config/config';
import { authService } from './AuthService';
import { UserProfile } from '@/types/types';

// Cache to store user profiles by ID
const userProfileCache: Record<string, { profile: UserProfile; timestamp: number }> = {};
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get the current logged-in user's profile
 */
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  // This was previously in AuthService.getUserProfile
  const response = await authService.fetchWithAuth(`${config.apiUrl}/users/profile`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  const profile = await response.json();
  
  // Cache the current user's profile
  userProfileCache[profile._id] = {
    profile,
    timestamp: Date.now()
  };
  
  return profile;
};

/**
 * Get a user profile by ID (can be used for other users)
 */
export const getUserById = async (userId: string): Promise<UserProfile> => {
  // Check if we have a valid cached version
  const cachedUser = userProfileCache[userId];
  const now = Date.now();
  
  if (cachedUser && (now - cachedUser.timestamp) < CACHE_EXPIRY_MS) {
    return cachedUser.profile;
  }
  
  // If not cached or expired, fetch from API
  const response = await authService.fetchWithAuth(`${config.apiUrl}/users/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile for ID: ${userId}`);
  }
  
  const profile = await response.json();
  
  // Cache the result
  userProfileCache[userId] = {
    profile,
    timestamp: now
  };
  
  return profile;
};

/**
 * Clear the user profile cache
 */
export const clearUserCache = (): void => {
  Object.keys(userProfileCache).forEach(key => {
    delete userProfileCache[key];
  });
}; 