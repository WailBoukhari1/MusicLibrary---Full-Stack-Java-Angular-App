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
    'Clear User': emptyProps(),

    // Load Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Update User Roles
    'Update User Role': props<{ userId: string; roles: string[] }>(),
    'Update User Role Success': props<{ user: User }>(),
    'Update User Role Failure': props<{ error: string }>(),

    // Delete User
    'Delete User': props<{ userId: string }>(),
    'Delete User Success': props<{ userId: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Toggle User Status
    'Toggle User Status': props<{ userId: string }>(),
    'Toggle User Status Success': props<{ user: User }>(),
    'Toggle User Status Failure': props<{ error: string }>()
  }
}); 