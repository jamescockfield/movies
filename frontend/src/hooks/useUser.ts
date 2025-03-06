import { User } from '@/types/types';
import { fetchCurrentUser, fetchUserById } from '@/services/api/users';
import { useFetch } from './useFetch';

export const useCurrentUser = () => {
  const { data, isLoading, error } = useFetch<User>(fetchCurrentUser, undefined);
  return { user: data, isLoading, error };
};

export const useUserById = (userId: string) => {
  const { data, isLoading, error } = useFetch<User, string>(fetchUserById, userId);
  return { user: data, isLoading, error };
};