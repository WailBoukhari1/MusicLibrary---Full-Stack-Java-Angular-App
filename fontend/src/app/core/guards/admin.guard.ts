import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
        }
      }),
      map(isAuthenticated => {
        if (!isAuthenticated) return false;
        
        const isAdmin = this.authService.isAdmin();
        if (!isAdmin) {
          this.router.navigate(['/unauthorized']);
        }
        return isAdmin;
      })
    );
  }
} 