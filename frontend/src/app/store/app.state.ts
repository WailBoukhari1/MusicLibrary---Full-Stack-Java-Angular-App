import { SongState } from './song/song.state';
import { AlbumState } from './album/album.state';

export interface AppState {
  songs: SongState;
  albums: AlbumState;
} 