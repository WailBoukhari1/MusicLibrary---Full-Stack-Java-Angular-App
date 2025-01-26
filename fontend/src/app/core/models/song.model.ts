import { CategoryEnum, GenreEnum } from './enums.model';
import { Album } from './album.model';

export interface Song {
  id: number;
  title: string;
  artist: string;
  albumId?: string;
  album?: Album;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  audioFileId?: string;
  imageFileId?: string;
  category?: string;
  genre?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SongResponse {
  success: boolean;
  data: Song;
  error?: string;
}

export interface SongsResponse {
  success: boolean;
  data: Song[];
  error?: string;
} 