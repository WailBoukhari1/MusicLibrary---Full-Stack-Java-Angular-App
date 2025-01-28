import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { UserEffects } from './user.effects';
import { UserService } from '../../services/user/user.service';
import * as UserActions from './user.actions';
import { hot, cold } from 'jasmine-marbles';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'updateUser', 'deleteUser']);
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: spy }
      ]
    });

    effects = TestBed.inject(UserEffects);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadUsers$', () => {
    it('should return a loadUsersSuccess action', () => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      const action = UserActions.loadUsers();
      const outcome = UserActions.loadUsersSuccess({ users });

      userService.getUsers.and.returnValue(of(users));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.loadUsers$).toBeObservable(expected);
    });

    it('should return a loadUsersFailure action on error', () => {
      const error = new Error('Error loading users');
      const action = UserActions.loadUsers();
      const outcome = UserActions.loadUsersFailure({ error: error.message });

      userService.getUsers.and.returnValue(throwError(() => error));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });

  describe('createUser$', () => {
    it('should return a createUserSuccess action', () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = { id: 1, ...newUser };
      const action = UserActions.createUser({ user: newUser });
      const outcome = UserActions.createUserSuccess({ user: createdUser });

      userService.createUser.and.returnValue(of(createdUser));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.createUser$).toBeObservable(expected);
    });
  });

  describe('deleteUser$', () => {
    it('should return a deleteUserSuccess action', () => {
      const userId = 1;
      const action = UserActions.deleteUser({ id: userId });
      const outcome = UserActions.deleteUserSuccess({ id: userId });

      userService.deleteUser.and.returnValue(of(void 0));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.deleteUser$).toBeObservable(expected);
    });
  });
}); 