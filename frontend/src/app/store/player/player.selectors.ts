import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
  selectPlayerState,
  (state) => state.currentTrack
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state) => state.isPlaying
);

export const selectQueue = createSelector(
  selectPlayerState,
  (state) => state.queue
);

export const selectCurrentIndex = createSelector(
  selectPlayerState,
  (state) => state.currentIndex
);

export const selectCanSkipNext = createSelector(
  selectPlayerState,
  (state) => state.currentIndex < state.queue.length - 1
);

export const selectCanSkipPrevious = createSelector(
  selectPlayerState,
  (state) => state.currentIndex > 0
); 