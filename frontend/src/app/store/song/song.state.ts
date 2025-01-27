import { Song } from '../../core/models/song.model';

export interface SongState {
  songs: Song[];
  selectedSong: Song | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  favorites: Song[];
  success: boolean;
}

export const initialSongState: SongState = {
  songs: [],
  selectedSong: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null,
  favorites: [],
  success: false
}; 