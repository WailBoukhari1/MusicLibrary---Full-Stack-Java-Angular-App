import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../core/services/user.service';
import { UserActions } from './user.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadProfile),
      mergeMap(() =>
        this.userService.getCurrentUserProfile().pipe(
          map(response => UserActions.loadProfileSuccess({ user: response.data })),
          catchError(error => of(UserActions.loadProfileFailure({ 
            error: error.error?.message || 'Failed to load profile' 
          })))
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfile),
      mergeMap(({ user }) =>
        this.userService.updateProfile(user).pipe(
          map(response => UserActions.updateProfileSuccess({ user: response.data })),
          catchError(error => of(UserActions.updateProfileFailure({ 
            error: error.error?.message || 'Failed to update profile' 
          })))
        )
      )
    )
  );

  updateAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateAvatar),
      mergeMap(({ formData }) =>
        this.userService.updateAvatar(formData).pipe(
          map(response => UserActions.updateAvatarSuccess({ 
            avatarUrl: response.data.avatarUrl 
          })),
          catchError(error => of(UserActions.updateAvatarFailure({ 
            error: error.error?.message || 'Failed to update avatar' 
          })))
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.changePassword),
      mergeMap(({ currentPassword, newPassword }) =>
        this.userService.changePassword(currentPassword, newPassword).pipe(
          map(() => UserActions.changePasswordSuccess()),
          catchError(error => of(UserActions.changePasswordFailure({ 
            error: error.error?.message || 'Failed to change password' 
          })))
        )
      )
    )
  );

  loadPlaylists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadPlaylists),
      mergeMap(() =>
        this.userService.getUserPlaylists().pipe(
          map(response => UserActions.loadPlaylistsSuccess({ 
            playlists: response.data 
          })),
          catchError(error => of(UserActions.loadPlaylistsFailure({ 
            error: error.error?.message || 'Failed to load playlists' 
          })))
        )
      )
    )
  );

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadFavorites),
      mergeMap(() =>
        this.userService.getUserFavorites().pipe(
          map(response => UserActions.loadFavoritesSuccess({ 
            favorites: response.data 
          })),
          catchError(error => of(UserActions.loadFavoritesFailure({ 
            error: error.error?.message || 'Failed to load favorites' 
          })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
} 