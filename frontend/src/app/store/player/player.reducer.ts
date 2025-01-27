import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';
import { initialPlayerState } from './player.state';
import { Album } from '../../core/models/album.model';

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
  
  on(PlayerActions.setPlaying, (state, { isPlaying }) => ({
    ...state,
    isPlaying
  })),
  
  on(PlayerActions.playAlbum, (state, { songs }) => ({
    ...state,
    currentAlbum: {
      id: songs[0]?.albumId || '',
      songs: songs,
      title: songs[0]?.albumTitle || '',
      artist: songs[0]?.albumArtist || ''
    } as Album,
    currentSong: songs[0],
    isPlaying: true
  })),
  
  on(PlayerActions.skipNext, (state) => {
    const currentIndex = state.currentAlbum?.songs?.findIndex(s => s.id === state.currentSong?.id) ?? -1;
    const nextSong = state.currentAlbum?.songs?.[currentIndex + 1];
    return {
      ...state,
      currentSong: nextSong || state.currentSong,
      isPlaying: !!nextSong
    };
  }),
  
  on(PlayerActions.skipPrevious, (state) => {
    const currentIndex = state.currentAlbum?.songs?.findIndex(s => s.id === state.currentSong?.id) ?? -1;
    const previousSong = state.currentAlbum?.songs?.[currentIndex - 1];
    return {
      ...state,
      currentSong: previousSong || state.currentSong,
      isPlaying: !!previousSong
    };
  })
);