import { Song } from "../../core/models/song.model";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Song[];
}

export const initialPlayerState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  queue: []
}; 