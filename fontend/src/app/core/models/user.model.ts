export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: string[];
  active?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  success: boolean;
  data: User;
  error?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  error?: string;
} 