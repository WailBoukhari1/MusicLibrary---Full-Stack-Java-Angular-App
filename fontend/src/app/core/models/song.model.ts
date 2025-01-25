export interface Song {
  id?: string;
  title: string;
  artist: string;
  trackNumber: number;
  description?: string;
  audioFileId?: string;
  imageFileId?: string;
  duration?: number;
  albumId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SongResponse {
  id: string;
  title: string;
  artist: string;
  trackNumber: number;
  description: string;
  audioFileId: string;
  imageFileId: string;
  duration: number;
  albumId: string;
  createdAt: Date;
  updatedAt: Date;
} 