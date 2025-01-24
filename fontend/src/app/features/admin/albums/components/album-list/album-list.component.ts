import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Album } from '../../models/album.model';
import { AlbumActions } from '../../store/album.actions';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { selectAlbums, selectTotalElements } from '../../store/album.selectors';
import { environment } from '../../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Page } from '../../../../../core/models/page.model';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h2>Albums</h2>
        <button mat-raised-button color="primary" (click)="onAddNew()">
          <mat-icon>add</mat-icon>
          Add New Album
        </button>
      </div>

      <ng-container *ngIf="albums$ | async as albums">
        <mat-table [dataSource]="albums">
          <ng-container matColumnDef="imageUrl">
            <mat-header-cell *matHeaderCellDef>Image</mat-header-cell>
            <mat-cell *matCellDef="let album">
              <img [src]="getImageUrl(album.coverUrl)" alt="album cover" class="album-image">
            </mat-cell>
          </ng-container>

          <ng-container matColumnDef="title">
            <mat-header-cell *matHeaderCellDef>Title</mat-header-cell>
            <mat-cell *matCellDef="let album">{{album.title}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="artist">
            <mat-header-cell *matHeaderCellDef>Artist</mat-header-cell>
            <mat-cell *matCellDef="let album">{{album.artist}}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
            <mat-cell *matCellDef="let album">{{album.category}}</mat-cell>
          </ng-container>
          <ng-container matColumnDef="genre">
            <mat-header-cell *matHeaderCellDef>Genre</mat-header-cell>
            <mat-cell *matCellDef="let album">{{album.genre}}</mat-cell>
          </ng-container>

          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
            <mat-cell *matCellDef="let album">
              <button mat-icon-button color="primary" (click)="onEdit(album)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDelete(album)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </ng-container>

      <mat-paginator
        [length]="totalElements$ | async"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .album-image {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    mat-table {
      margin-bottom: 20px;
    }
  `]
})
export class AlbumListComponent implements OnInit {
  albums$ = this.store.select(selectAlbums);
  totalElements$ = this.store.select(selectTotalElements);
  displayedColumns = ['imageUrl', 'title', 'artist', 'category', 'genre', 'actions'];
  pageSize = 10;
  currentPage = 0;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['albumsData'].success) {
        const pageData: Page<Album> = data['albumsData'].data;
        this.albums$ = this.store.select(selectAlbums, { page: pageData.number, size: pageData.size });
        this.totalElements$ = this.store.select(selectTotalElements, { page: pageData.number, size: pageData.size });
        this.pageSize = pageData.size;
        this.currentPage = pageData.number;
      }
    });
  }

  loadAlbums() {
    this.store.dispatch(AlbumActions.loadAlbums({ 
      page: this.currentPage,
      size: this.pageSize 
    }));
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  onAddNew() {
    this.store.dispatch(AlbumActions.selectAlbum({ album: null }));
    this.router.navigate(['/admin/albums/new']);
  }

  onEdit(album: Album) {
    this.store.dispatch(AlbumActions.selectAlbum({ album }));
    this.router.navigate(['/admin/albums/edit', album.id]);
  }

  onDelete(album: Album) {
    if (confirm('Are you sure you want to delete this album?')) {
      this.store.dispatch(AlbumActions.deleteAlbum({ id: album.id }));
    }
  }

  getImageUrl(coverUrl: string | null | undefined): string {
    return `${environment.apiUrl}/files/images/${coverUrl}`;
  }
} 