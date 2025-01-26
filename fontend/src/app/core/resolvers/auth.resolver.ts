import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first, map, tap } from 'rxjs/operators';
import { AuthActions } from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';

export const authResolver: ResolveFn<boolean> = () => {
  const store = inject(Store);

  return store.select(selectUser).pipe(
    tap(user => {
      if (!user) {
        store.dispatch(AuthActions.getCurrentUser());
      }
    }),
    filter(user => !!user),
    map(() => true),
    first()
  );
};