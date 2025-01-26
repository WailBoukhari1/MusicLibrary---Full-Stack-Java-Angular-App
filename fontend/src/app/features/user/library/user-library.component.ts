import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { Album } from '../../../core/models/album.model';
import { AlbumService } from '../../../core/services/album.service';
import { CategoryEnum, GenreEnum, EnumMapper, EnumValue } from '../../../core/models/enums.model';
import { EnumService } from '../../../core/services/enum.service';
import { PlayerService } from '../../../core/services/player.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-library',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="filters-section">
        <form [formGroup]="filterForm" class="filter-form">
          <mat-form-field appearance="outline">
            <mat-label>Search</mat-label>
            <input matInput placeholder="Search albums..." formControlName="search">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option [value]="''">All</mat-option>
              <mat-option *ngFor="let cat of categories" [value]="cat.name">
                {{cat.displayName}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Genre</mat-label>
            <mat-select formControlName="genre">
              <mat-option [value]="''">All</mat-option>
              <mat-option *ngFor="let gen of genres" [value]="gen.name">
                {{gen.displayName}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <mat-select formControlName="year">
              <mat-option [value]="''">All</mat-option>
              <mat-option *ngFor="let year of years" [value]="year">
                {{year}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </form>

        <mat-chip-listbox *ngIf="hasActiveFilters()" class="active-filters">
          <mat-chip *ngIf="filterForm.get('search')?.value"
                   (removed)="clearFilter('search')">
            Search: {{filterForm.get('search')?.value}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
          <mat-chip *ngIf="filterForm.get('category')?.value"
                   (removed)="clearFilter('category')">
            Category: {{getCategoryDisplayName(filterForm.get('category')?.value)}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
          <mat-chip *ngIf="filterForm.get('genre')?.value"
                   (removed)="clearFilter('genre')">
            Genre: {{getGenreDisplayName(filterForm.get('genre')?.value)}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
          <mat-chip *ngIf="filterForm.get('year')?.value"
                   (removed)="clearFilter('year')">
            Year: {{filterForm.get('year')?.value}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
        </mat-chip-listbox>
      </div>

      <div class="loading-shade" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
      </div>

      <div class="albums-grid" *ngIf="!isLoading">
        <mat-card *ngFor="let album of filteredAlbums" class="album-card">
          <img mat-card-image [src]="getImageUrl(album.coverUrl)" 
               [alt]="album.title"
               (error)="onImageError($event)">
          <mat-card-content>
            <h3>{{album.title}}</h3>
            <p>{{album.artist}}</p>
            <p class="album-info">
              <span class="category">{{getCategoryDisplayName(album.category || '')}}</span>
              <span class="genre">{{getGenreDisplayName(album.genre || '')}}</span>
              <span class="year">{{album.releaseDate | date:'yyyy'}}</span>
            </p>
            <p *ngIf="album.description" class="description">{{album.description}}</p>
            <p class="songs-count" *ngIf="album.songs?.length">
              {{album.songs.length}} song{{album.songs.length !== 1 ? 's' : ''}}
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" 
                    [disabled]="!album.songs?.length"
                    (click)="playAlbum(album)">
              <mat-icon>{{isCurrentAlbum(album) ? 'pause' : 'play_arrow'}}</mat-icon> 
              {{isCurrentAlbum(album) ? 'Pause' : 'Play'}}
            </button>
            <button mat-button (click)="toggleFavorite(album)">
              <mat-icon>{{isFavorite(album) ? 'favorite' : 'favorite_border'}}</mat-icon>
              {{isFavorite(album) ? 'Remove' : 'Add'}}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && filteredAlbums.length === 0">
        <mat-icon>album</mat-icon>
        <p>No albums found matching your criteria</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .filters-section {
      margin-bottom: 20px;
    }

    .filter-form {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .active-filters {
      margin-top: 10px;
    }

    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .album-card {
      max-width: 100%;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-5px);
      }

      img {
        height: 200px;
        object-fit: cover;
        background-color: #f5f5f5;
      }

      .songs-count {
        font-size: 0.9em;
        color: #666;
        margin-top: 8px;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;

        button {
          flex: 1;
          margin: 0 4px;
          
          &[disabled] {
            opacity: 0.6;
          }
        }
      }
    }

    .album-info {
      display: flex;
      gap: 8px;
      font-size: 0.9em;
      color: #666;

      span {
        background: #f5f5f5;
        padding: 2px 8px;
        border-radius: 12px;
      }
    }

    .description {
      margin-top: 8px;
      font-size: 0.9em;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .loading-shade {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
    }
  `]
})
export class UserLibraryComponent implements OnInit {
  albums: Album[] = [];
  filteredAlbums: Album[] = [];
  filterForm: FormGroup;
  isLoading = false;
  categories: CategoryEnum[] = [];
  genres: GenreEnum[] = [];
  years: number[] = [];
  favorites: Set<string> = new Set();
  currentAlbumId: string | null = null;

  constructor(
    private albumService: AlbumService,
    private enumService: EnumService,
    private playerService: PlayerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      genre: [''],
      year: ['']
    });

    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 50}, (_, i) => currentYear - i);
  }

  ngOnInit() {
    this.loadEnums();
    this.loadAlbums();
    this.setupFilterSubscription();
    this.playerService.currentTrack$.subscribe((track: Track | null) => {
      if (track?.albumId) {
        this.currentAlbumId = track.albumId;
      }
    });
  }

  private loadEnums() {
    this.enumService.getCategories().subscribe(response => {
      if (response.success && response.data) {
        this.categories = response.data;
      }
    });

    this.enumService.getGenres().subscribe(response => {
      if (response.success && response.data) {
        this.genres = response.data;
      }
    });
  }

  getCategoryDisplayName(name: string | undefined): string {
    return name ? EnumMapper.getDisplayName(this.categories, name) : '';
  }

  getGenreDisplayName(name: string | undefined): string {
    return name ? EnumMapper.getDisplayName(this.genres, name) : '';
  }

  private loadAlbums() {
    this.isLoading = true;
    this.albumService.getAlbums().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.albums = response.data.content;
          this.applyFilters();
        }
      },
      error: () => {
        this.showError('Failed to load albums');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private setupFilterSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private applyFilters() {
    const filters = this.filterForm.value;
    
    this.filteredAlbums = this.albums.filter(album => {
      const matchesSearch = !filters.search || 
        album.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        album.artist.toLowerCase().includes(filters.search.toLowerCase());
        
      const matchesCategory = !filters.category || album.category === filters.category;
      const matchesGenre = !filters.genre || album.genre === filters.genre;
      const matchesYear = !filters.year || (
        album.releaseDate && 
        new Date(album.releaseDate).getFullYear() === Number(filters.year)
      );

      return matchesSearch && matchesCategory && matchesGenre && matchesYear;
    });
  }

  clearFilter(filterName: string) {
    this.filterForm.get(filterName)?.setValue('');
  }

  hasActiveFilters(): boolean {
    const filters = this.filterForm.value;
    return Object.values(filters).some(value => value !== '');
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/images/default-album.png';
    }
    return `${environment.apiUrl}/files/${imageUrl}`;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/default-album.png';
  }

  playAlbum(album: Album) {
    if (!album.songs?.length) {
      this.showError('No songs available in this album');
      return;
    }

    if (this.isCurrentAlbum(album)) {
      this.playerService.togglePlay();
    } else {
      this.playerService.playAlbum(album);
      this.showSuccess(`Playing album: ${album.title}`);
    }
  }

  isCurrentAlbum(album: Album): boolean {
    return this.currentAlbumId === album.id;
  }

  toggleFavorite(album: Album) {
    if (this.isFavorite(album)) {
      this.favorites.delete(album.id);
      this.showSuccess('Removed from favorites');
    } else {
      this.favorites.add(album.id);
      this.showSuccess('Added to favorites');
    }
  }

  isFavorite(album: Album): boolean {
    return this.favorites.has(album.id);
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
} 