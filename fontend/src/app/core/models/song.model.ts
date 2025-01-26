import { CategoryEnum, GenreEnum } from './enums.model';
import { Album } from './album.model';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumId?: string;
  album?: Album;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  audioFileId?: string;
  imageFileId?: string;
  trackNumber?: number;
  description?: string;
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