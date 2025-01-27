import { createAction, props } from '@ngrx/store';
import { Song } from '../../core/models/song.model';

// Load Songs
export const loadSongs = createAction(
  '[Song] Load Songs',
  props<{ page: number; size: number }>()
);

export const loadSongsSuccess = createAction(
  '[Song] Load Songs Success',
  props<{ 
    songs: Song[]; 
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>()
);

export const loadSongsFailure = createAction(
  '[Song] Load Songs Failure',
  props<{ error: string }>()
);

// Create Song
export const createSong = createAction(
  '[Song] Create Song',
  props<{ song: FormData }>()
);

export const createSongSuccess = createAction(
  '[Song] Create Song Success',
  props<{ song: Song }>()
);

export const createSongFailure = createAction(
  '[Song] Create Song Failure',
  props<{ error: string }>()
);

// Update Song
export const updateSong = createAction(
  '[Song] Update Song',
  props<{ id: string; song: FormData }>()
);

export const updateSongSuccess = createAction(
  '[Song] Update Song Success',
  props<{ song: Song }>()
);

export const updateSongFailure = createAction(
  '[Song] Update Song Failure',
  props<{ error: string }>()
);

// Delete Song
export const deleteSong = createAction(
  '[Song] Delete Song',
  props<{ id: string }>()
);

export const deleteSongSuccess = createAction(
  '[Song] Delete Song Success',
  props<{ id: string }>()
);

export const deleteSongFailure = createAction(
  '[Song] Delete Song Failure',
  props<{ error: string }>()
);

// Search Songs
export const searchSongs = createAction(
  '[Song] Search Songs',
  props<{ query: string }>()
);

export const searchSongsSuccess = createAction(
  '[Song] Search Songs Success',
  props<{ songs: Song[] }>()
);

export const searchSongsFailure = createAction(
  '[Song] Search Songs Failure',
  props<{ error: string }>()
);

// Select Song
export const selectSong = createAction(
  '[Song] Select Song',
  props<{ song: Song | null }>()
);

// Clear Songs
export const clearSongs = createAction(
  '[Song] Clear Songs'
);

// Clear Errors
export const clearErrors = createAction(
  '[Song] Clear Errors'
);

// Get Song By Id
export const getSongById = createAction(
  '[Song] Get Song By Id',
  props<{ id: string }>()
);

// Toggle Favorite
export const toggleFavorite = createAction(
  '[Song] Toggle Favorite',
  props<{ song: Song }>()
);

export const toggleFavoriteSuccess = createAction(
  '[Song] Toggle Favorite Success',
  props<{ song: Song }>()
);

export const toggleFavoriteFailure = createAction(
  '[Song] Toggle Favorite Failure',
  props<{ error: string }>()
);

// Load Song
export const loadSong = createAction(
  '[Song] Load Song',
  props<{ id: string }>()
);

export const loadSongSuccess = createAction(
  '[Song] Load Song Success',
  props<{ song: Song }>()
);

export const loadSongFailure = createAction(
  '[Song] Load Song Failure',
  props<{ error: string }>()
);

export const clearSelectedSong = createAction(
  '[Song] Clear Selected Song'
); 