import { config } from '@/config/config';
import { authService } from './AuthService';
import { UserProfile } from '@/types/types';

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const response = await authService.fetchWithAuth(`${config.apiUrl}/users/profile`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
};

/**
 * Get a user profile by ID (can be used for other users)
 */
export const getUserById = async (userId: string): Promise<UserProfile> => {
  const response = await authService.fetchWithAuth(`${config.apiUrl}/users/${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user profile for ID: ${userId}`);
  }
  
  return response.json();
};