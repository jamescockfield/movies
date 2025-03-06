import { authService } from '@/services/api/AuthService';

export const searchMovies = async (query: string) => {
  const params = new URLSearchParams();
  params.append('q', query);
  
  const url = `/movies/search?${params.toString()}`;
  
  const response = await authService.fetchWithAuth(url);

  return response.json();
}

export const fetchMovieById = async (movieId: string) => {
  const url = `/movies/${movieId}`;
  
  const response = await authService.fetchWithAuth(url);

  return response.json();
}

export const fetchMoviesByGenreIds = async (genreIds: number[], moviesPerGenre: number) => {
  const params = new URLSearchParams();
  params.append('genreIds', genreIds.join(','));
  params.append('moviesPerGenre', moviesPerGenre.toString());
  
  const url = `/movies/?${params.toString()}`;
  
  const response = await authService.fetchWithAuth(url);

  return response.json();
}