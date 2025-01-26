import { User } from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    username: string;
    roles: string[];
  };
  error: string | null;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
} 