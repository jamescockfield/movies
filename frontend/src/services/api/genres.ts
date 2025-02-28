import { authService } from "./AuthService";
import { config } from "@/config/config";

export const fetchGenres = async () => {
  const response = await authService.fetchWithAuth(`${config.apiUrl}/genres/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}