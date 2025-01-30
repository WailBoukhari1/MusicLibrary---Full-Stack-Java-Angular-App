import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectUser } from '../../store/auth/auth.selectors';

export const adminGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
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