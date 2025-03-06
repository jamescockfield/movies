import { authService } from './AuthService';
import { UserProfile } from '@/types/types';

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const response = await authService.fetchWithAuth(`/users`);
  
  return response.json();
};

export const getUserById = async (userId: string): Promise<UserProfile> => {
  const response = await authService.fetchWithAuth(`/users/${userId}`);
  
  return response.json();
};