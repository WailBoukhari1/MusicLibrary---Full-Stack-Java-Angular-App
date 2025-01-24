import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserModel } from '../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ username: string; password: string }>(),
    'Login Success': props<{ user: UserModel; token: string; refreshToken: string }>(),
    'Login Failure': props<{ error: string }>(),
    
    'Register Request': props<{ username: string; email: string; password: string }>(),
    'Register Success': props<{ user: UserModel }>(),
    'Register Failure': props<{ error: string }>(),
    
    'Logout Request': emptyProps(),
    'Logout Success': emptyProps(),
    
    'Get Current User Request': emptyProps(),
    'Get Current User Success': props<{ user: UserModel }>(),
    'Get Current User Failure': props<{ error: string }>(),
    
    'Refresh Token Request': emptyProps(),
    'Refresh Token Success': props<{ token: string; refreshToken: string }>(),
    'Refresh Token Failure': props<{ error: string }>(),
    
    'Clear Error': emptyProps()
  }
}); 