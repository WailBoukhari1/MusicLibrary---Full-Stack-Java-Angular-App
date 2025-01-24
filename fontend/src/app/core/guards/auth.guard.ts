import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/store/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectAuthLoading).pipe(
      filter(loading => !loading), // Wait until loading is complete
      take(1),
      map(() => {
        const isAuthenticated = Boolean(localStorage.getItem('token'));
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
} 