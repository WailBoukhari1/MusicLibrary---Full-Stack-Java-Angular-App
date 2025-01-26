import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init': emptyProps(),
    'Login': props<{ username: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    
    'Register': props<{ username: string; email: string; password: string }>(),
    'Register Success': props<{ user: User }>(),
    'Register Failure': props<{ error: string }>(),
    
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    
    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ user: User }>(),
    'Get Current User Failure': props<{ error: string }>()
  }
}); 