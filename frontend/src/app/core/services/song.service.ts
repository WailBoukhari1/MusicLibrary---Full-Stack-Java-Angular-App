import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Song } from '../models/song.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = `${environment.apiUrl}/songs`;

  constructor(private http: HttpClient) {}

  getSongs(page: number = 0, size: number = 10): Observable<ApiResponse<Page<Song>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<ApiResponse<Page<Song>>>(this.apiUrl, { params });
  }

  createSong(songData: FormData): Observable<ApiResponse<Song>> {
    return this.http.post<ApiResponse<Song>>(this.apiUrl, songData);
  }

  updateSong(id: string, songData: FormData): Observable<ApiResponse<Song>> {
    return this.http.put<ApiResponse<Song>>(`${this.apiUrl}/${id}`, songData);
  }

  deleteSong(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchSongs(query: string): Observable<ApiResponse<Song[]>> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ApiResponse<Song[]>>(`${this.apiUrl}/search`, { params });
  }

  getSongById(id: string): Observable<Song> {
    return this.http.get<ApiResponse<Song>>(`${environment.apiUrl}/songs/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return {
            ...response.data,
            audioUrl: response.data.audioFileId 
              ? `${environment.apiUrl}/files/${response.data.audioFileId}`
              : '',
            imageUrl: response.data.imageFileId 
              ? `${environment.apiUrl}/files/${response.data.imageFileId}`
              : ''
          };
        }
        throw new Error('Failed to fetch song');
      })
    );
  }

  toggleFavorite(song: Song): Observable<ApiResponse<Song>> {
    return this.http.post<ApiResponse<Song>>(
      `${environment.apiUrl}/songs/${song.id}/favorite`,
      {}
    ).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to toggle favorite');
        }
        return response;
      })
    );
  }

  getSong(id: string): Observable<ApiResponse<Song>> {
    return this.http.get<ApiResponse<Song>>(`${this.apiUrl}/${id}`);
  }
} 