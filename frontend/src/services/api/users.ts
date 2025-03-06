import { authService } from './AuthService';
import { User } from '@/types/types';

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await authService.fetchWithAuth(`/users`);
  
  return response.json();
};

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await authService.fetchWithAuth(`/users/${userId}`);
  
  return response.json();
};