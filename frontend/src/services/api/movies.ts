import { config } from '@/config/config';
import { authService } from '@/services/api/AuthService';

export const fetchMovies = async () => {
  const response = await authService.fetchWithAuth(`${config.apiUrl}/movies/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}