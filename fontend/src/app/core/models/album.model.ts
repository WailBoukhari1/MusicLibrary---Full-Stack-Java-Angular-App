import { Song } from './song.model';

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  releaseDate: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: string;
  genre: string;
  description?: string;
  songs: Song[];
  songIds: string[];
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