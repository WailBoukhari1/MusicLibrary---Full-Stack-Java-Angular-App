import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, first, mergeMap } from 'rxjs/operators';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectAuthToken } from '../../store/auth/auth.selectors';
import { EMPTY, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Skip auth header for public endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  return store.select(selectAuthToken).pipe(
    first(),
    mergeMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
      return next(req).pipe(
        catchError(error => {
          if (error.status === 401) {
            store.dispatch(AuthActions.logout());
            return EMPTY;
          }
          return throwError(() => error);
        })
      );
    })
  );
}; 