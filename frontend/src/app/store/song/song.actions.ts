import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Song } from '../../core/models/song.model';

export const SongActions = createActionGroup({
  source: 'Song',
  events: {
    // Load Songs
    'Load Songs': props<{ page: number; size: number }>(),
    'Load Songs Success': props<{ 
      songs: Song[]; 
      totalElements: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>(),
    'Load Songs Failure': props<{ error: string }>(),
    
    // Create Song
    'Create Song': props<{ song: FormData }>(),
    'Create Song Success': props<{ song: Song }>(),
    'Create Song Failure': props<{ error: string }>(),
    
    // Update Song
    'Update Song': props<{ id: string; song: FormData }>(),
    'Update Song Success': props<{ song: Song }>(),
    'Update Song Failure': props<{ error: string }>(),
    
    // Delete Song
    'Delete Song': props<{ id: string }>(),
    'Delete Song Success': props<{ id: string }>(),
    'Delete Song Failure': props<{ error: string }>(),
    
    // Search Songs
    'Search Songs': props<{ query: string }>(),
    'Search Songs Success': props<{ songs: Song[] }>(),
    'Search Songs Failure': props<{ error: string }>(),
    
    // Select Song
    'Select Song': props<{ song: Song | null }>(),
    
    // Clear Songs
    'Clear Songs': emptyProps(),
    
    // Clear Errors
    'Clear Errors': emptyProps(),
    
    // Get Song By Id
    'Get Song By Id': props<{ id: string }>(),
    
    // Load Favorites
    'Load Favorites': emptyProps(),
    'Load Favorites Success': props<{ songs: Song[] }>(),
    'Load Favorites Failure': props<{ error: string }>(),
    'Toggle Favorite': props<{ songId: string }>(),
    'Toggle Favorite Success': props<{ song: Song }>(),
    'Toggle Favorite Failure': props<{ error: string }>(),
    
    // Load Song
    'Load Song': props<{ id: string }>(),
    'Load Song Success': props<{ song: Song }>(),
    'Load Song Failure': props<{ error: string }>(),
  }
}); 