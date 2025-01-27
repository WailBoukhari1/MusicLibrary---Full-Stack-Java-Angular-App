import { ApiResponse, PageResponse } from './api-response.model';

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

export type UserPageResponse = ApiResponse<PageResponse<User>>;
export type SingleUserResponse = ApiResponse<User>; 