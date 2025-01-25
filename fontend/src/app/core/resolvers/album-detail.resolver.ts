import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, of, timeout } from 'rxjs';
import { AlbumService } from '../services/album.service';
import { ApiResponse } from '../models/api-response.model';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumDetailResolver implements Resolve<ApiResponse<Album>> {
  constructor(private albumService: AlbumService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ApiResponse<Album>> {
    const id = route.paramMap.get('id');
    if (!id) {
      return of({
        success: false,
        error: 'Album ID not provided',
        data: undefined
      });
    }

    return this.albumService.getAlbum(id).pipe(
      catchError(error => {
        console.error('Error loading album:', error);
        return of({
          success: false,
          error: 'Failed to load album details',
          data: undefined
        });
      }),
      timeout(5000)
    );
  }
} 