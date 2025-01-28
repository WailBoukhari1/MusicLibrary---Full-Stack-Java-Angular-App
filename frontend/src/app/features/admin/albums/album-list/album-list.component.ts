import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Album } from '../../../../core/models/album.model';
import * as AlbumActions from '../../../../store/album/album.actions';
import { selectAllAlbums, selectAlbumLoading, selectAlbumError, selectTotalElements } from '../../../../store/album/album.selectors';
import { environment } from '../../../../../environments/environment';
import { MatMenuModule } from '@angular/material/menu';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: "album-list.component.html"
})
export class AlbumListComponent implements OnInit {
  albums$: Observable<Album[]> = this.store.select(selectAllAlbums);
  loading$ = this.store.select(selectAlbumLoading);
  error$ = this.store.select(selectAlbumError);
  total$ = this.store.select(selectTotalElements);
  totalAlbums$ = this.store.select(selectTotalElements);
  stats$ = this.albums$.pipe(
    map(albums => ({
      total: albums.length,

    }))
  );

  pageSize = 10;
  displayedColumns = ['imageUrl', 'title', 'artist', 'releaseDate', 'actions'];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.store.dispatch(AlbumActions.loadAlbums());
  }

  onCreateAlbum() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(album: Album) {
    this.router.navigate(['edit', album.id], { relativeTo: this.route });
  }

  onDelete(album: Album) {
    if (confirm('Are you sure you want to delete this album?')) {
      this.store.dispatch(AlbumActions.deleteAlbum({ id: album.id }));
    }
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/images/default-album.png';
    }
    return `${environment.apiUrl}/files/${imageUrl}`;
  }
} 