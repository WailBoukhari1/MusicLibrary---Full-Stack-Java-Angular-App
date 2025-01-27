import { Album } from "../../core/models/album.model";
import { Song } from "../../core/models/song.model";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Song[];
  currentAlbum: Album | null;

}

export const initialPlayerState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  queue: [],
  currentAlbum: null
}; 