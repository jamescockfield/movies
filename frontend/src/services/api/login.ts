import { config } from '@/config/constants';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const auth = {
  setTokens(access: string, refresh: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${config.apiUrl}/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const tokens = await response.json();
  auth.setTokens(tokens.access, tokens.refresh);
  return tokens;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 401) {
        // Token expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        const refreshResponse = await fetch(`${config.apiUrl}/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshResponse.ok) {
            const { access } = await refreshResponse.json();
            localStorage.setItem('accessToken', access);
            
            // Retry original request with new token
            return fetchWithAuth(url, options);
        } else {
            // Refresh failed, redirect to login
            window.location.href = '/login';
        }
    }

    return response;
}
