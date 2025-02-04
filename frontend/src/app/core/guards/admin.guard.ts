import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, filter, take } from 'rxjs';
import { selectUser } from '../../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.getToken()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return store.select(selectUser).pipe(
    filter(user => user !== null),
    take(1),
    map(user => {
      if (!user || !user.roles.includes('ADMIN')) {
        router.navigate(['/user/home']);
        return false;
      }
      return true;
    })
  );
}; 