import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Album, AlbumResponse, AlbumsResponse } from '../models/album.model';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = `${environment.apiUrl}/albums`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAlbums(page: number = 0, size: number = 10): Observable<ApiResponse<Page<Album>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<Page<Album>>>(`${this.apiUrl}`, { params })
      .pipe(
        map(response => {
          if (response.data) {
            response.data.content = response.data.content.map(album => ({
              ...album,
              songs: [],
              songIds: album.songs.map(song => song.id)
            }));
          }
          return response;
        })
      );
  }

  createAlbum(albumData: FormData): Observable<ApiResponse<Album>> {
    return this.http.post<ApiResponse<Album>>(this.apiUrl, albumData, {
      headers: this.getHeaders()
    });
  }

  updateAlbum(id: string, albumData: FormData): Observable<ApiResponse<Album>> {
    return this.http.put<ApiResponse<Album>>(`${this.apiUrl}/${id}`, albumData, {
      headers: this.getHeaders()
    });
  }

  deleteAlbum(id: string): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('deleteSongs', 'true');
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { params });
  }

  getAlbum(id: number | string): Observable<ApiResponse<Album>> {
    return this.http.get<ApiResponse<Album>>(`${this.apiUrl}/${id}`);
  }

  getAllAlbums(): Observable<AlbumsResponse> {
    return this.http.get<AlbumsResponse>(this.apiUrl);
  }

  searchAlbums(query: string): Observable<AlbumsResponse> {
    return this.http.get<AlbumsResponse>(`${this.apiUrl}/search?query=${query}`);
  }

  getAlbumById(id: string): Observable<AlbumResponse> {
    return this.http.get<AlbumResponse>(`${this.apiUrl}/${id}`);
  }


}