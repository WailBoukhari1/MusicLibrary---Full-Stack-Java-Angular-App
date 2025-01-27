import { createReducer, on } from '@ngrx/store';
import { Album } from '../../core/models/album.model';
import * as AlbumActions from './album.actions';
import * as SongActions from '../song/song.actions';

export interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
  success: boolean;
  selectedAlbum: Album | null;
}

export const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
  success: false,
  selectedAlbum: null
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
  on(AlbumActions.resetAlbumState, () => initialState),

  // Update selected album when a song is updated
  on(SongActions.updateSongSuccess, (state, { song }) => {
    if (!state.selectedAlbum || !state.selectedAlbum.songs) {
      return state;
    }

    const updatedSongs = state.selectedAlbum.songs.map(s => 
      s.id === song.id ? song : s
    );

    return {
      ...state,
      selectedAlbum: {
        ...state.selectedAlbum,
        songs: updatedSongs
      },
      // Also update the song in the albums list if it exists
      albums: state.albums.map(album => {
        if (album.id === song.albumId && album.songs) {
          return {
            ...album,
            songs: album.songs.map(s => s.id === song.id ? song : s)
          };
        }
        return album;
      })
    };
  }),

  // Load Album
  on(AlbumActions.loadAlbumSuccess, (state, { album }) => ({
    ...state,
    selectedAlbum: album,
    loading: false,
    error: null
  }))
); 