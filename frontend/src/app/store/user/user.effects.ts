import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../core/services/user.service';
import { UserActions } from './user.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getAllUsers().pipe(
          map(response => {
            if (!response.data?.content) {
              throw new Error('No data received');
            }
            return UserActions.loadUsersSuccess({ 
              users: response.data.content 
            });
          }),
          catchError(error => of(UserActions.loadUsersFailure({
            error: error.message || 'Failed to load users'
          })))
        )
      )
    )
  );

  updateUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserRole),
      mergeMap(({ userId, roles }) =>
        this.userService.updateUserRoles(userId, roles).pipe(
          map(response => {
            if (!response.data) {
              throw new Error('No data received');
            }
            return UserActions.updateUserRoleSuccess({ user: response.data });
          }),
          catchError(error => of(UserActions.updateUserRoleFailure({
            error: error.message || 'Failed to update user role'
          })))
        )
      )
    )
  );

  toggleUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.toggleUserStatus),
      mergeMap(({ userId }) =>
        this.userService.toggleUserStatus(userId).pipe(
          map(response => {
            if (!response.data) {
              throw new Error('No data received');
            }
            return UserActions.toggleUserStatusSuccess({ user: response.data });
          }),
          catchError(error => of(UserActions.toggleUserStatusFailure({
            error: error.message || 'Failed to toggle user status'
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