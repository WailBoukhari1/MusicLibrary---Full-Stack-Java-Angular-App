import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { UserActions } from './user.actions';

export interface UserState {
  profile: User | null;
  playlists: any[];
  favorites: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  playlists: [],
  favorites: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  
  // Load Profile
  on(UserActions.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.loadProfileSuccess, (state, { user }) => ({
    ...state,
    profile: user,
    loading: false
  })),
  
  on(UserActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Update Profile
  on(UserActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    profile: user,
    loading: false
  })),
  
  on(UserActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Update Avatar
  on(UserActions.updateAvatar, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.updateAvatarSuccess, (state, { avatarUrl }) => ({
    ...state,
    profile: state.profile ? { ...state.profile, avatarUrl } : null,
    loading: false
  })),
  
  on(UserActions.updateAvatarFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Load Playlists
  on(UserActions.loadPlaylists, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.loadPlaylistsSuccess, (state, { playlists }) => ({
    ...state,
    playlists,
    loading: false
  })),
  
  on(UserActions.loadPlaylistsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Load Favorites
  on(UserActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    loading: false
  })),
  
  on(UserActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Clear User
  on(UserActions.clearUser, () => initialState)
); 