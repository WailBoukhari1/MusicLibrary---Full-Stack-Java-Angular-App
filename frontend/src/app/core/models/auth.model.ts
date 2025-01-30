import { User } from './user.model';
import { ApiResponse } from './api-response.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthData {
  username: string;
  token: string;
  roles: string[];
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthData;
  error?: string;
}

export { ApiResponse }; 