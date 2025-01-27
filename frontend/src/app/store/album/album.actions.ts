import { createAction, props } from '@ngrx/store';
import { Album } from '../../core/models/album.model';

// Load Albums
export const loadAlbums = createAction('[Album] Load Albums');
export const loadAlbumsSuccess = createAction(
  '[Album] Load Albums Success',
  props<{ albums: Album[], totalElements: number }>()
);
export const loadAlbumsFailure = createAction(
  '[Album] Load Albums Failure',
  props<{ error: string }>()
);

// Create Album
export const createAlbum = createAction(
  '[Album] Create Album',
  props<{ album: FormData }>()
);
export const createAlbumSuccess = createAction(
  '[Album] Create Album Success',
  props<{ album: Album }>()
);
export const createAlbumFailure = createAction(
  '[Album] Create Album Failure',
  props<{ error: string }>()
);

// Update Album
export const updateAlbum = createAction(
  '[Album] Update Album',
  props<{ id: string; album: FormData }>()
);
export const updateAlbumSuccess = createAction(
  '[Album] Update Album Success',
  props<{ album: Album }>()
);
export const updateAlbumFailure = createAction(
  '[Album] Update Album Failure',
  props<{ error: string }>()
);

// Delete Album
export const deleteAlbum = createAction(
  '[Album] Delete Album',
  props<{ id: string }>()
);
export const deleteAlbumSuccess = createAction(
  '[Album] Delete Album Success',
  props<{ id: string }>()
);
export const deleteAlbumFailure = createAction(
  '[Album] Delete Album Failure',
  props<{ error: string }>()
);

// Reset State
export const resetAlbumState = createAction('[Album] Reset State');

// Select Album
export const selectAlbum = createAction(
  '[Album] Select Album',
  props<{ album: Album | null }>()
);

// Load Album
export const loadAlbum = createAction(
  '[Album] Load Album',
  props<{ id: string }>()
);
export const loadAlbumSuccess = createAction(
  '[Album] Load Album Success',
  props<{ album: Album }>()
);
export const loadAlbumFailure = createAction(
  '[Album] Load Album Failure',
  props<{ error: string }>()
);

// Set Error
export const setError = createAction(
  '[Album] Set Error',
  props<{ error: string }>()
);

// Clear Error
export const clearError = createAction('[Album] Clear Error');

// Clear Selected Album
export const clearSelectedAlbum = createAction('[Album] Clear Selected Album'); 