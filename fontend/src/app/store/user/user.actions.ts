import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load User Profile
    'Load Profile': emptyProps(),
    'Load Profile Success': props<{ user: User }>(),
    'Load Profile Failure': props<{ error: string }>(),
    
    // Update User Profile
    'Update Profile': props<{ user: Partial<User> }>(),
    'Update Profile Success': props<{ user: User }>(),
    'Update Profile Failure': props<{ error: string }>(),
    
    // Update User Avatar
    'Update Avatar': props<{ formData: FormData }>(),
    'Update Avatar Success': props<{ avatarUrl: string }>(),
    'Update Avatar Failure': props<{ error: string }>(),
    
    // Change Password
    'Change Password': props<{ currentPassword: string; newPassword: string }>(),
    'Change Password Success': emptyProps(),
    'Change Password Failure': props<{ error: string }>(),
    
    // Get User Playlists
    'Load Playlists': emptyProps(),
    'Load Playlists Success': props<{ playlists: any[] }>(),
    'Load Playlists Failure': props<{ error: string }>(),
    
    // Get User Favorites
    'Load Favorites': emptyProps(),
    'Load Favorites Success': props<{ favorites: any[] }>(),
    'Load Favorites Failure': props<{ error: string }>(),
    
    // Clear User State
    'Clear User': emptyProps()
  }
}); 