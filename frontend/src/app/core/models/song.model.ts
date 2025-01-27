import { CategoryEnum, GenreEnum } from './enums.model';
import { Album } from './album.model';
import { ApiResponse, PageResponse } from './api-response.model';

export interface Song {
  id: string;
  title: string;
  artist: string;
  trackNumber?: number;
  description?: string;
  audioFileId?: string;
  imageFileId?: string;
  audioUrl?: string;
  imageUrl?: string;
  albumId?: string;
  albumTitle?: string;
  albumArtist?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isFavorite?: boolean;
}

export type SongPageResponse = ApiResponse<PageResponse<Song>>;
export type SingleSongResponse = ApiResponse<Song>;

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