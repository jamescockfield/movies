import { config } from '@/config/config';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${config.apiUrl}/auth/login`, {
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
    this.setTokens(tokens.access, tokens.refresh);
    return tokens;
  }

  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
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
        this.setTokens(access, refreshToken!);
        
        // Retry original request with new token
        return this.fetchWithAuth(url, options);
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }

    return response;
  }
}

// Export a singleton instance
export const authService = AuthService.getInstance();
