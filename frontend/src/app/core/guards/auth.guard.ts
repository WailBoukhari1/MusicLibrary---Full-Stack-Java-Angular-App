import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsAuthenticated, selectUser } from '../../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectIsAuthenticated).pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting
  const currentUrl = window.location.pathname;
  if (currentUrl !== '/auth/login') {
    localStorage.setItem('redirectUrl', currentUrl);
  }
  
  router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    map(user => {
      if (!user || !user.roles.includes('ADMIN')) {
        return router.createUrlTree(['/user/library']);
      }
      return true;
    })
  );
};

// export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
//   return (route, state) => {
//     const router = inject(Router);
//     const authService = inject(AuthService);

//     return authService.isAuthenticated$().pipe(
//       take(1),
//       map(isAuthenticated => {
//         if (!isAuthenticated) {
//           router.navigate(['/auth/login']);
//           return false;
//         }

//         const userRoles = authService.getUserRoles();
//         const hasRole = allowedRoles.some(role => userRoles.includes(role));
        
//         if (!hasRole) {
//           router.navigate(['/']);
//           return false;
//         }

//         return true;
//       })
//     );
//   };
// }; 