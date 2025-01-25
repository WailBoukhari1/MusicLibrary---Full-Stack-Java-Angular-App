import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { AuthActions } from '../../store/auth/auth.actions';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);

  // Skip authentication for public endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Add token if available
  const token = authService.getToken();
  if (token) {
    console.log('Adding token to request:', req.url);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Request error:', error);
      if (error.status === 401) {
        store.dispatch(AuthActions.logoutRequest());
      }
      return throwError(() => error);
    })
  );
}; 