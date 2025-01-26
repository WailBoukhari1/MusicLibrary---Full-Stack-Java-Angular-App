import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

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

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
); 