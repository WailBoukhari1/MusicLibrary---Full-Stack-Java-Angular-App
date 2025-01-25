import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AlbumActions } from '../../store/album/album.actions';
import { AlbumService } from '../services/album.service';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumListResolver implements Resolve<ApiResponse<Page<Album>>> {
  constructor(private store: Store, private albumService: AlbumService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ApiResponse<Page<Album>>> {
    const page = route.queryParams['page'] ? Number(route.queryParams['page']) : 0;
    const size = route.queryParams['size'] ? Number(route.queryParams['size']) : 10;

    this.store.dispatch(AlbumActions.loadAlbums({ page, size }));

    return this.albumService.getAlbums(page, size).pipe(
      catchError(error => {
        console.error('Error loading albums:', error);
        return of({
          success: false,
          error: 'Failed to load albums',
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: size,
            number: page
          }
        });
      })
    );
  }
} 