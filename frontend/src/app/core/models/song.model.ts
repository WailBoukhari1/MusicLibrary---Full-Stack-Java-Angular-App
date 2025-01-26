import { CategoryEnum, GenreEnum } from './enums.model';
import { Album } from './album.model';

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  trackNumber?: number;
  description?: string;
  audioFileId?: string;
  imageFileId?: string;
  albumId?: string;
  audioUrl?: string;
  imageUrl?: string;
  albumTitle?: string;
  albumArtist?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorite?: boolean;
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