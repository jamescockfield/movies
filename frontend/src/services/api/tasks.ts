import { config } from '@/config/constants';
import { fetchWithAuth } from '@/services/api/login';

export const fetchTasks = async () => {
  const response = await fetchWithAuth(`${config.apiUrl}/tasks/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}