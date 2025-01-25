import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Song, SongResponse } from '../models/song.model';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private apiUrl = `${environment.apiUrl}/songs`;

  constructor(private http: HttpClient) {}

  getAllSongs(page = 0, size = 10): Observable<ApiResponse<Page<SongResponse>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<Page<SongResponse>>>(this.apiUrl, { params });
  }

  getSongById(id: string): Observable<ApiResponse<SongResponse>> {
    return this.http.get<ApiResponse<SongResponse>>(`${this.apiUrl}/${id}`);
  }

  createSong(song: FormData): Observable<ApiResponse<SongResponse>> {
    return this.http.post<ApiResponse<SongResponse>>(this.apiUrl, song);
  }

  updateSong(id: string, song: FormData): Observable<ApiResponse<SongResponse>> {
    return this.http.put<ApiResponse<SongResponse>>(`${this.apiUrl}/${id}`, song);
  }

  deleteSong(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchSongs(query: string, page = 0, size = 10): Observable<ApiResponse<Page<SongResponse>>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<Page<SongResponse>>>(`${this.apiUrl}/search`, { params });
  }
} 