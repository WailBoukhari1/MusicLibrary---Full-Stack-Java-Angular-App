import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
  selectPlayerState,
  (state) => state.currentSong
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state) => state.isPlaying
);

export const selectCanSkipNext = createSelector(
  selectPlayerState,
  (state) => state.queue.length > 0
);

export const selectCanSkipPrevious = createSelector(
  selectPlayerState,
  (state) => state.queue.length > 0
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state) => state.progress
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
); 