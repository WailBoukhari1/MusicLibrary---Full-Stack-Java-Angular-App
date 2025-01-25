export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  active: boolean;
  createdAt: Date;
}

export interface UserResponse {
  success: boolean;
  data: User;
  error?: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  error?: string;
} 