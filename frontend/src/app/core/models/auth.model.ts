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
  token: string;
  refreshToken: string;
  username: string;
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

export type AuthResponse = ApiResponse<AuthData>;

export { ApiResponse }; 