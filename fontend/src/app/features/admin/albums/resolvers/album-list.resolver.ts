import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AlbumActions } from '../store/album.actions';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { Page } from '../../../../core/models/page.model';
import { Album } from '../../../../core/models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumListResolver implements Resolve<void> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const page = route.queryParams['page'] || 0;
    const size = route.queryParams['size'] || 10;
    this.store.dispatch(AlbumActions.loadAlbums({ page, size }));
  }
} 