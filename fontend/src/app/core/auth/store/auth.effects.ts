import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of, defer } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map(response => {
            if (response.success && response.data) {
              return AuthActions.loginSuccess({ 
                user: {
                  id: '',
                  username: response.data.username,
                  email: '',
                  roles: response.data.roles,
                  active: true
                },
                token: response.data.token,
                refreshToken: response.data.refreshToken
              });
            }
            throw new Error(response.error || 'Login failed');
          }),
          catchError(error => of(AuthActions.loginFailure({ 
            error: error.error?.message || error.message || 'Login failed' 
          })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, refreshToken, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          const redirectUrl = user.roles.includes('ADMIN') ? '/admin/dashboard' : '/user/library';
          this.router.navigate([redirectUrl]);
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerRequest),
      mergeMap(({ username, email, password }) =>
        this.authService.register(username, email, password).pipe(
          map(response => {
            if (response.success && response.data) {
              return AuthActions.registerSuccess({ user: response.data });
            }
            throw new Error(response.error || 'Registration failed');
          }),
          catchError(error => of(AuthActions.registerFailure({ 
            error: error.error?.message || error.message || 'Registration failed' 
          })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequest),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          tap(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/auth/login']);
          })
        )
      )
    )
  );

  getCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getCurrentUserRequest),
      mergeMap(() =>
        this.authService.getCurrentUser().pipe(
          map(response => {
            if (response.success && response.data) {
              return AuthActions.getCurrentUserSuccess({ user: response.data });
            }
            throw new Error(response.error || 'Failed to get user');
          }),
          catchError(error => of(AuthActions.getCurrentUserFailure({ 
            error: error.error?.message || error.message || 'Failed to get user' 
          })))
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenRequest),
      mergeMap(() =>
        this.authService.refreshToken().pipe(
          map(response => {
            if (response.success && response.data) {
              return AuthActions.loginSuccess({ 
                user: {
                  id: '',
                  username: response.data.username,
                  email: '',
                  roles: response.data.roles,
                  active: true
                },
                token: response.data.token,
                refreshToken: response.data.refreshToken
              });
            }
            throw new Error(response.error || 'Token refresh failed');
          }),
          catchError(error => {
            this.router.navigate(['/auth/login']);
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  init$ = createEffect(() => 
    defer(() => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      if (token && refreshToken) {
        return this.authService.validateToken().pipe(
          mergeMap(() => this.authService.getCurrentUser()),
          map(response => {
            if (response.success && response.data) {
              return AuthActions.getCurrentUserSuccess({ user: response.data });
            }
            throw new Error('Token validation failed');
          }),
          catchError(() => {
            // Try to refresh token if validation fails
            return this.authService.refreshToken().pipe(
              map(response => {
                if (response.success && response.data) {
                  return AuthActions.loginSuccess({ 
                    user: {
                      id: '',
                      username: response.data.username,
                      email: '',
                      roles: response.data.roles,
                      active: true
                    },
                    token: response.data.token,
                    refreshToken: response.data.refreshToken
                  });
                }
                throw new Error('Token refresh failed');
              }),
              catchError(() => {
                this.authService.clearTokens();
                return of(AuthActions.logoutSuccess());
              })
            );
          })
        );
      }
      return of(AuthActions.logoutSuccess());
    })
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
} 