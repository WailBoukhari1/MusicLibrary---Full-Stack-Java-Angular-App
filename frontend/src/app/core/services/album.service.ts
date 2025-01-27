import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Album, AlbumPageResponse, SingleAlbumResponse } from '../models/album.model';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getAlbums(page = 0, size = 10): Observable<ApiResponse<Page<Album>>> {
    const params = this.createQueryParams({ page, size });
    return this.http.get<ApiResponse<Page<Album>>>(`${this.baseUrl}/albums`, { params })
      .pipe(catchError(this.handleError));
  }

  createAlbum(albumData: FormData): Observable<ApiResponse<Album>> {
    return this.http.post<ApiResponse<Album>>(`${this.baseUrl}/albums`, albumData, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateAlbum(id: string, albumData: FormData): Observable<ApiResponse<Album>> {
    return this.http.put<ApiResponse<Album>>(`${this.baseUrl}/albums/${id}`, albumData, {
      headers: this.getHeaders()
    });
  }

  deleteAlbum(id: string): Observable<ApiResponse<void>> {
    const params = new HttpParams().set('deleteSongs', 'true');
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/albums/${id}`, { params });
  }

  getAlbum(id: number | string): Observable<ApiResponse<Album>> {
    return this.http.get<ApiResponse<Album>>(`${this.baseUrl}/albums/${id}`);
  }

  getAllAlbums(): Observable<AlbumPageResponse> {
    return this.http.get<AlbumPageResponse>(`${this.baseUrl}/albums`);
  }

  searchAlbums(query: string): Observable<AlbumPageResponse> {
    return this.http.get<AlbumPageResponse>(`${this.baseUrl}/albums/search?query=${query}`);
  }

  getAlbumById(id: string): Observable<ApiResponse<Album>> {
    return this.http.get<ApiResponse<Album>>(`${this.baseUrl}/albums/${id}`);
  }

  // getAlbums(): Observable<ApiResponse<Page<Album>>> {
  //   return this.http.get<ApiResponse<Page<Album>>>(`${environment.apiUrl}/api/albums`);
  // }
}