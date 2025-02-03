import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, UserResponse } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';
import { AlertService } from '../../core/services/alert.service';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map(response => {
            if (!response.success || !response.data) {
              throw new Error(response.error || 'Invalid response data');
            }

            const user: User = {
              id: response.data.username,
              username: response.data.username,
              email: '',
              roles: response.data.roles,
              active: true,
              createdAt: new Date()
            };

            this.alertService.success('Login successful!');
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
    );
  });

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          // Don't navigate if we're initializing the app
          if (this.router.url.includes('/auth')) {
            const route = user.roles.includes('ADMIN') ? '/admin/dashboard' : '/user/home';
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
            this.alertService.success('Registration successful! Please login to continue.');
            return AuthActions.registerSuccess({ user: response.data });
          }),
          catchError(error => of(AuthActions.registerFailure({ 
            error: error.error?.message || 'Registration failed' 
          })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
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
              if (!response.success || !response.data) {
                throw new Error('Invalid user data');
              }
              return AuthActions.loginSuccess({ 
                user: response.data,
                token 
              });
            }),
            catchError(() => {
              localStorage.removeItem('token');
              this.router.navigate(['/auth/login']);
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
    private router: Router,
    private alertService: AlertService
  ) {}
} 