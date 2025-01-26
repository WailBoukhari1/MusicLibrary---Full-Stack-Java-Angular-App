import { createReducer, on } from '@ngrx/store';
import { PlayerActions } from './player.actions';
import { PlayerState, initialPlayerState } from './player.state';

export const playerReducer = createReducer(
  initialPlayerState,
  on(PlayerActions.playAlbum, (state, { album }) => ({
    ...state,
    queue: album.songs || [],
    currentTrack: album.songs?.[0] || null,
    currentIndex: 0,
    isPlaying: true
  })),
  on(PlayerActions.playTrack, (state, { song }) => ({
    ...state,
    currentTrack: song,
    currentIndex: state.queue.findIndex(s => s.id === song.id),
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
  on(PlayerActions.nextTrack, (state) => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.queue.length) return state;
    return {
      ...state,
      currentTrack: state.queue[nextIndex],
      currentIndex: nextIndex
    };
  }),
  on(PlayerActions.previousTrack, (state) => {
    const prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) return state;
    return {
      ...state,
      currentTrack: state.queue[prevIndex],
      currentIndex: prevIndex
    };
  })
); 