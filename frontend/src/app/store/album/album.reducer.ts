import { createReducer, on } from '@ngrx/store';
import { Album } from '../../core/models/album.model';
import * as AlbumActions from './album.actions';

export interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
  success: false
};

export const albumReducer = createReducer(
  initialState,
  
  // Load Albums
  on(AlbumActions.loadAlbums, state => ({
    ...state,
    loading: true,
    error: null,
    success: false
  })),
  on(AlbumActions.loadAlbumsSuccess, (state, { albums }) => ({
    ...state,
    albums,
    loading: false,
    error: null,
    success: true
  })),
  on(AlbumActions.loadAlbumsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false
  })),

  // Create Album
  on(AlbumActions.createAlbum, state => ({
    ...state,
    loading: true,
    error: null,
    success: false
  })),
  on(AlbumActions.createAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: [...state.albums, album],
    loading: false,
    error: null,
    success: true
  })),
  on(AlbumActions.createAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false
  })),

  // Update Album
  on(AlbumActions.updateAlbum, state => ({
    ...state,
    loading: true,
    error: null,
    success: false
  })),
  on(AlbumActions.updateAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: state.albums.map(a => a.id === album.id ? album : a),
    loading: false,
    error: null,
    success: true
  })),
  on(AlbumActions.updateAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false
  })),

  // Delete Album
  on(AlbumActions.deleteAlbum, state => ({
    ...state,
    loading: true,
    error: null,
    success: false
  })),
  on(AlbumActions.deleteAlbumSuccess, (state, { id }) => ({
    ...state,
    albums: state.albums.filter(album => album.id !== id),
    loading: false,
    error: null,
    success: true
  })),
  on(AlbumActions.deleteAlbumFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    success: false
  })),

  // Reset State
  on(AlbumActions.resetAlbumState, () => initialState)
); 