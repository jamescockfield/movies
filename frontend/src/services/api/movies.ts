import { config } from '@/config/config';
import { authService } from '@/services/api/AuthService';

export const fetchMovies = async (genreIds?: number[], moviesPerGenre?: number) => {
  let url = `${config.apiUrl}/movies/`;
  
  // Add query parameters if provided
  if (genreIds && genreIds.length > 0) {
    const params = new URLSearchParams();
    params.append('genreIds', genreIds.join(','));
    
    if (moviesPerGenre) {
      params.append('moviesPerGenre', moviesPerGenre.toString());
    }
    
    url += `?${params.toString()}`;
  }
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const fetchMovieById = async (movieId: string) => {
  const url = `${config.apiUrl}/movies/${movieId}`;
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const searchMovies = async (query: string) => {
  const params = new URLSearchParams();
  params.append('q', query);
  
  const url = `${config.apiUrl}/movies/search?${params.toString()}`;
  
  const response = await authService.fetchWithAuth(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}