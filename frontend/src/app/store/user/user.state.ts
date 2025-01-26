import { User } from '../../core/models/user.model';

export interface UserState {
  // List management
  users: User[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  selectedUser: User | null;

  // User profile
  profile: User | null;
  playlists: any[];
  favorites: any[];
}

export const initialUserState: UserState = {
  // List management
  users: [],
  loading: false,
  error: null,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  selectedUser: null,

  // User profile
  profile: null,
  playlists: [],
  favorites: []
}; 