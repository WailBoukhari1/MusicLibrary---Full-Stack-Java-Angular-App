import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    }

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']); // Redirect non-admin users to user dashboard
    } else {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    }
    return false;
  }
} 