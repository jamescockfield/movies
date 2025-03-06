import { config } from '@/config/config';

interface LoginResponse {
  success: boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export class AuthService {

  public static readonly SUCCESS_STATUS_CODES = [200, 201];

  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${config.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    // Call logout endpoint to clear HttpOnly cookies
    await fetch(`${config.apiUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }

  async fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${config.apiUrl}${path}`, {
      ...options,
      credentials: 'include', // Important for cookies
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshResponse = await fetch(`${config.apiUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Server will set new HttpOnly cookies
        // Retry original request
        return this.fetchWithAuth(path, options);
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }

    if (!AuthService.SUCCESS_STATUS_CODES.includes(response.status)) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }
}

// Export a singleton instance
export const authService = AuthService.getInstance();
