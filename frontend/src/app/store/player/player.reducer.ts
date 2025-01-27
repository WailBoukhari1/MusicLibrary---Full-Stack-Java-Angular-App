import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';
import { initialPlayerState } from './player.state';

export const playerReducer = createReducer(
  initialPlayerState,
  
  on(PlayerActions.play, (state, { song }) => ({
    ...state,
    currentSong: song,
    isPlaying: true
  })),
  
  on(PlayerActions.pause, (state) => ({
    ...state,
    isPlaying: false
  })),
  
  on(PlayerActions.resume, (state) => ({
    ...state,
    isPlaying: true
  })),
  
  on(PlayerActions.setVolume, (state, { volume }) => ({
    ...state,
    volume
  })),
  
  on(PlayerActions.setProgress, (state, { progress }) => ({
    ...state,
    progress
  })),
  
  on(PlayerActions.setQueue, (state, { songs }) => ({
    ...state,
    queue: songs
  })),
  
  on(PlayerActions.setPlaying, (state, { isPlaying }) => ({
    ...state,
    isPlaying
  }))
);