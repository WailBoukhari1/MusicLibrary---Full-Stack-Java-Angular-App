import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
      }),
      map(isAuthenticated => {
        if (!isAuthenticated) return false;

        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles) {
          const userRoles = this.authService.getUserRoles();
          return requiredRoles.some(role => userRoles.includes(role));
        }

        return true;
      })
    );
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  console.log('Checking admin access...'); // Debug
  const isAdmin = authService.isAdmin();
  console.log('Is admin?', isAdmin); // Debug
  
  if (!isAdmin) {
    console.log('Access denied - not an admin'); // Debug
    router.navigate(['/']);
    return false;
  }
  
  return true;
}; 