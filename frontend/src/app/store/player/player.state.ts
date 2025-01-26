export interface PlayerState {
  currentTrack: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
} 