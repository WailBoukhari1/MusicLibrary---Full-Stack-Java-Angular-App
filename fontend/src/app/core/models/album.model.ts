import { Song } from './song.model';

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  releaseDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  category?: string;
  genre?: string;
  description?: string;
  songs?: Song[];
}

export interface AlbumResponse {
  success: boolean;
  data: Album;
  error?: string;
}

export interface AlbumsResponse {
  success: boolean;
  data: Album[];
  error?: string;
} 