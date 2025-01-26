import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  updateSong(id: number, songData: FormData): Observable<ApiResponse<Song>> {
    return this.http.put<ApiResponse<Song>>(`${this.apiUrl}/${id}`, songData);
  }

  deleteSong(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchSongs(query: string): Observable<ApiResponse<Song[]>> {
    const params = new HttpParams().set('query', query);
    return this.http.get<ApiResponse<Song[]>>(`${this.apiUrl}/search`, { params });
  }

  getSongById(id: number): Observable<ApiResponse<Song>> {
    return this.http.get<ApiResponse<Song>>(`${this.apiUrl}/${id}`);
  }
} 