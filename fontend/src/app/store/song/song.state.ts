import { Song } from '../../core/models/song.model';

export interface SongState {
  songs: Song[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const initialSongState: SongState = {
  songs: [],
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10
}; 