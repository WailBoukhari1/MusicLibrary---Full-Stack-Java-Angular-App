import { createReducer, on } from '@ngrx/store';
import { Song } from '../../core/models/song.model';
import * as SongActions from './song.actions';

export interface SongState {
  songs: Song[];
  currentSong: Song | null;
  selectedSong: Song | null;
  favorites: Song[];
  loading: boolean;
  error: string | null;
  success: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const initialState: SongState = {
  songs: [],
  currentSong: null,
  selectedSong: null,
  favorites: [],
  loading: false,
  error: null,
  success: false,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10
};

export const songReducer = createReducer(
  initialState,
  
  // Load Songs
  on(SongActions.loadSongs, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.loadSongsSuccess, (state, { songs, totalElements, totalPages, currentPage, pageSize }) => ({
    ...state,
    songs,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    loading: false
  })),
  
  on(SongActions.loadSongsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Create Song
  on(SongActions.createSong, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.createSongSuccess, (state, { song }) => ({
    ...state,
    songs: [...state.songs, song],
    loading: false
  })),
  
  on(SongActions.createSongFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Update Song
  on(SongActions.updateSong, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.updateSongSuccess, (state, { song }) => ({
    ...state,
    songs: state.songs.map(s => s.id === song.id ? song : s),
    loading: false
  })),
  
  on(SongActions.updateSongFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Delete Song
  on(SongActions.deleteSong, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.deleteSongSuccess, (state, { id }) => ({
    ...state,
    songs: state.songs.filter(song => song.id !== id),
    loading: false
  })),
  
  on(SongActions.deleteSongFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  
  // Search Songs
  on(SongActions.searchSongs, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.searchSongsSuccess, (state, { songs }) => ({
    ...state,
    songs,
    loading: false
  })),
  
  on(SongActions.searchSongsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
    
  on(SongActions.toggleFavorite, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.toggleFavoriteSuccess, (state, { song }) => ({
    ...state,
    favorites: state.favorites.map(s => s.id === song.id ? song : s),
    loading: false
  })),
  
  on(SongActions.toggleFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select Song
  on(SongActions.selectSong, (state, { song }) => ({
    ...state,
    selectedSong: song
  })),
  
  // Clear Songs
  on(SongActions.clearSongs, (state) => ({
    ...state,
    songs: [],
    totalElements: 0,
    error: null
  })),
  
  // Clear Errors
  on(SongActions.clearErrors, (state) => ({
    ...state,
    error: null
  })),
  
  on(SongActions.clearSelectedSong, (state) => ({
    ...state,
    selectedSong: null
  })),
  
  on(SongActions.loadSong, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(SongActions.loadSongSuccess, (state, { song }) => ({
    ...state,
    selectedSong: song,
    loading: false
  })),
  
  on(SongActions.loadSongFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(SongActions.loadFavoriteSongsSuccess, (state, { songs }) => ({
    ...state,
    favorites: songs,
    loading: false,
    error: null
  }))
); 