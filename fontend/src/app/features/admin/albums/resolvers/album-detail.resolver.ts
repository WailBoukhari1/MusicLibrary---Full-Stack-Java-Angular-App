import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlbumActions } from '../store/album.actions';

@Injectable({
  providedIn: 'root'
})
export class AlbumDetailResolver implements Resolve<void> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const id = route.params['id'];
    if (id) {
      this.store.dispatch(AlbumActions.loadAlbum({ id }));
    }
  }
} 