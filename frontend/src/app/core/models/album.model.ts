import { Song } from './song.model';
import { CategoryEnum, GenreEnum } from './enums.model';

export interface Album {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
  releaseDate?: Date;
  category: string;
  genre: string;
  songs: Song[];
  songIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlbumResponse {
  success: boolean;
  data: {
    content: Album[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
}

export interface AlbumsResponse {
  success: boolean;
  data: Album[];
  error?: string;
} 