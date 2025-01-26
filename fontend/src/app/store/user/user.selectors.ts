import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state) => state.error
);

export const selectUserTotalElements = createSelector(
  selectUserState,
  (state) => state.totalElements
);

export const selectUserProfile = createSelector(
  selectUserState,
  (state: UserState) => state.profile
);

export const selectUserPlaylists = createSelector(
  selectUserState,
  (state: UserState) => state.playlists
);

export const selectUserFavorites = createSelector(
  selectUserState,
  (state: UserState) => state.favorites
); 