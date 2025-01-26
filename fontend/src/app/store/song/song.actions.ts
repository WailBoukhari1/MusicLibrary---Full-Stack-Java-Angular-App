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
    'Update Song': props<{ id: number; song: FormData }>(),
    'Update Song Success': props<{ song: Song }>(),
    'Update Song Failure': props<{ error: string }>(),
    
    // Delete Song
    'Delete Song': props<{ id: number }>(),
    'Delete Song Success': props<{ id: number }>(),
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
    'Clear Errors': emptyProps()
  }
}); 