export interface UserModel {
  id: string;
  username: string;
  email: string;
  roles: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 