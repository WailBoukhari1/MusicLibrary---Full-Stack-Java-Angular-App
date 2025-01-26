import { Song } from '../../core/models/song.model';

export interface PlayerState {
  currentTrack: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentIndex: number;
}

export const initialPlayerState: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentIndex: -1
}; 