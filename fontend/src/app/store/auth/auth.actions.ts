import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { LoginRequest ,RegisterRequest} from '../../core/models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ request: LoginRequest }>(),
    'Login Success': props<{ user: User; token: string; refreshToken: string }>(),
    'Login Failure': props<{ error: string }>(),
    
    'Register Request': props<{ request: RegisterRequest }>(),
    'Register Success': props<{ user: User }>(),
    'Register Failure': props<{ error: string }>(),
    
    'Logout Request': emptyProps(),
    'Logout Success': emptyProps(),
    
    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ user: User }>(),
    'Get Current User Failure': props<{ error: string }>(),
    
    'Refresh Token Request': emptyProps(),
    'Refresh Token Success': props<{ token: string; refreshToken: string }>(),
    'Refresh Token Failure': props<{ error: string }>(),
    
    'Clear Error': emptyProps()
  }
}); 