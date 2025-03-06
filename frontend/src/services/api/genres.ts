import { authService } from "./AuthService";

export const fetchGenres = async () => {
  const response = await authService.fetchWithAuth(`/genres`);

  return response.json();
}