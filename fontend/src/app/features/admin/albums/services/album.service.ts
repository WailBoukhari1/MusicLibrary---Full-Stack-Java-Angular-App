import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Album } from '../models/album.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Page } from '../../../../core/models/page.model';
import { filter, map } from 'rxjs/operators';

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
    return this.http.get<ApiResponse<Page<Album>>>(`${this.apiUrl}`, {
      params: { page: page.toString(), size: size.toString() }
    });
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
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getAlbum(id: number | string): Observable<ApiResponse<Album>> {
    return this.http.get<ApiResponse<Album>>(`${this.apiUrl}/${id}`);
  }
}