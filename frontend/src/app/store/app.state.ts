import { AlbumState } from './album/album.state';
import { SongState } from './song/song.state';
import { PlayerState } from './player/player.state';

export interface AppState {
  albums: AlbumState;
  songs: SongState;
  player: PlayerState;
} 