import { Song } from './song.model';
import { CategoryEnum, GenreEnum } from './enums.model';
import { ApiResponse, PageResponse } from './api-response.model';

export interface Album {
  id: string;
  title: string;
  artist: string;
  imageUrl?: string;
  releaseDate: Date;
  category: CategoryEnum;
  genre: GenreEnum;
  songs?: Song[];
  songIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type AlbumPageResponse = ApiResponse<PageResponse<Album>>;
export type SingleAlbumResponse = ApiResponse<Album>; 