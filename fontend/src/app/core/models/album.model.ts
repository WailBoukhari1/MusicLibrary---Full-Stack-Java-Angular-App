export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  releaseDate: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: string;
  genre: string;
  songs: any[];
  description?: string;
} 