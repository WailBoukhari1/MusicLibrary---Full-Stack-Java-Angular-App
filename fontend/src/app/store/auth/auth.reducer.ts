import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => {
    localStorage.setItem('token', token);
    return {
      ...state,
      user,
      token,
      loading: false,
      error: null
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('token');
    return {
      ...state,
      user: null,
      token: null
    };
  }),

  // Get Current User
  on(AuthActions.getCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false
  })),


); 