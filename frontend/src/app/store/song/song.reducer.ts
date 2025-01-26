import { createReducer, on } from '@ngrx/store';
import { SongActions } from './song.actions';
import { initialSongState } from './song.state';


export const songReducer = createReducer(
  initialSongState,
  
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
  }))
); 