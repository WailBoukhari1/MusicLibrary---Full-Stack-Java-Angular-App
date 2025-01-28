import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../services/auth/auth.service';
import * as AuthActions from './auth.actions';
import { hot, cold } from 'jasmine-marbles';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: spy }
      ]
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$', () => {
    it('should return a loginSuccess action on successful login', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: 'test@example.com' };
      const action = AuthActions.login({ credentials });
      const outcome = AuthActions.loginSuccess({ user });

      authService.login.and.returnValue(of(user));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.login$).toBeObservable(expected);
    });

    it('should return a loginFailure action on login error', () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      const error = new Error('Invalid credentials');
      const action = AuthActions.login({ credentials });
      const outcome = AuthActions.loginFailure({ error: error.message });

      authService.login.and.returnValue(throwError(() => error));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.login$).toBeObservable(expected);
    });
  });
}); 