import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, UserResponse } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map(response => {
            if (!response.success || !response.data) {
              throw new Error(response.error || 'Invalid response data');
            }
            
            // Create user object from response data
            const user: User = {
              id: response.data.username, // Using username as id since it's unique
              username: response.data.username,
              email: '', // Will be populated by getCurrentUser if needed
              roles: response.data.roles,
              active: true,
              createdAt: new Date()
            };

            return AuthActions.loginSuccess({ 
              user,
              token: response.data.token 
            });
          }),
          catchError(error => of(AuthActions.loginFailure({ 
            error: error.message || 'Login failed' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ token, user }) => {
        localStorage.setItem('token', token);
        if (this.router.url.includes('/auth')) {
          const route = user.roles.includes('ADMIN') ? '/admin/dashboard' : '/user/library';
          this.router.navigate([route]);
        }
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ username, email, password }) =>
        this.authService.register(username, email, password).pipe(
          map(response => {
            if (!response.data) {
              throw new Error('Invalid response data');
            }
            return AuthActions.registerSuccess({ user: response.data });
          }),
          catchError(error => of(AuthActions.registerFailure({ 
            error: error.error?.message || 'Registration failed' 
          })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      }),
      map(() => AuthActions.logoutSuccess())
    )
  );

  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getCurrentUser),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map(response => {
            if (!response.data) {
              throw new Error('Invalid response data');
            }
            return AuthActions.getCurrentUserSuccess({ user: response.data });
          }),
          catchError(error => of(AuthActions.getCurrentUserFailure({ 
            error: error.error?.message || 'Failed to get user' 
          })))
        )
      )
    )
  );

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      mergeMap(() => {
        const token = localStorage.getItem('token');
        if (token) {
          return this.authService.getCurrentUser().pipe(
            map(response => {
              if (!response.data) {
                throw new Error('Invalid user data');
              }
              return AuthActions.loginSuccess({ 
                user: response.data,
                token: token 
              });
            }),
            catchError(() => {
              localStorage.removeItem('token');
              return of(AuthActions.logout());
            })
          );
        }
        return of(AuthActions.logout());
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
} 