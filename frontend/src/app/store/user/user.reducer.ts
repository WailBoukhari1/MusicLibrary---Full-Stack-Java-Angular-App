import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { UserActions } from './user.actions';
import { initialUserState, UserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,
  
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
  on(UserActions.clearUser, () => initialUserState),
  
  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null
  })),
  
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Toggle User Status
  on(UserActions.toggleUserStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(UserActions.toggleUserStatusSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
    error: null
  })),
  
  on(UserActions.toggleUserStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User Role
  on(UserActions.updateUserRole, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserRoleSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    loading: false,
    error: null
  })),

  on(UserActions.updateUserRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(user => user.id !== userId),
    loading: false,
    error: null
  })),

  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
); 