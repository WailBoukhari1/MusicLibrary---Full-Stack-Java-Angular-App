import { createReducer, on } from '@ngrx/store';
import { Song } from '../../core/models/song.model';
import { PlayerActions } from './player.actions';

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  shuffle: boolean;
  repeat: boolean;
}

const initialState: PlayerState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  progress: 0,
  shuffle: false,
  repeat: false
};

export const playerReducer = createReducer(
  initialState,
  
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
  
  on(PlayerActions.addToQueue, (state, { song }) => ({
    ...state,
    queue: [...state.queue, song]
  })),
  
  on(PlayerActions.removeFromQueue, (state, { songId }) => ({
    ...state,
    queue: state.queue.filter(song => song.id === songId)
  })),
  
  on(PlayerActions.clearQueue, (state) => ({
    ...state,
    queue: []
  })),
  
  on(PlayerActions.toggleShuffle, (state) => ({
    ...state,
    shuffle: !state.shuffle
  })),
  
  on(PlayerActions.toggleRepeat, (state) => ({
    ...state,
    repeat: !state.repeat
  }))
);