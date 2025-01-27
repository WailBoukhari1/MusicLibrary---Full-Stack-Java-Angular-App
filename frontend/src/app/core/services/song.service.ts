import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Song } from '../models/song.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SongService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getSongs(page = 0, size = 10): Observable<ApiResponse<Page<Song>>> {
    const params = this.createQueryParams({ page, size });
    return this.http.get<ApiResponse<Page<Song>>>(`${this.baseUrl}/songs`, { params })
      .pipe(catchError(this.handleError));
  }

  createSong(songData: FormData): Observable<ApiResponse<Song>> {
    return this.http.post<ApiResponse<Song>>(`${this.baseUrl}/songs`, songData);
  }

  updateSong(id: string, songData: FormData): Observable<ApiResponse<Song>> {
    return this.http.put<ApiResponse<Song>>(`${this.baseUrl}/songs/${id}`, songData);
  }

  deleteSong(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/songs/${id}`);
  }

  searchSongs(query: string): Observable<ApiResponse<Song[]>> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ApiResponse<Song[]>>(`${this.baseUrl}/songs/search`, { params });
  }

  getSongById(id: string): Observable<Song> {
    return this.http.get<ApiResponse<Song>>(`${this.baseUrl}/songs/${id}`)
      .pipe(
        map(response => ({
          ...response.data,
          audioUrl: this.getFileUrl(response.data.audioFileId),
          imageUrl: this.getFileUrl(response.data.imageFileId)
        })),
        catchError(this.handleError)
      );
  }

  toggleFavorite(song: Song): Observable<ApiResponse<Song>> {
    return this.http.post<ApiResponse<Song>>(
      `${this.baseUrl}/songs/${song.id}/favorite`,
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
    return this.http.get<ApiResponse<Song>>(`${this.baseUrl}/songs/${id}`);
  }
} 