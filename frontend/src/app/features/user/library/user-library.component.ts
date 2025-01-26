import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
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
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Album } from '../../../core/models/album.model';
import { AlbumService } from '../../../core/services/album.service';
import { CategoryEnum, GenreEnum, EnumMapper } from '../../../core/models/enums.model';
import { EnumService } from '../../../core/services/enum.service';
import { environment } from '../../../../environments/environment';
import { 
  selectCurrentTrack, 
  selectIsPlaying,
  selectCanSkipNext,
  selectCanSkipPrevious 
} from '../../../store/player/player.selectors';
import { PlayerActions } from '../../../store/player/player.actions';
import { Song } from '../../../core/models/song.model';
import { SongService } from '../../../core/services/song.service';
import { AppState } from '../../../store/app.state';

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
        <mat-card *ngFor="let album of albums" 
                  class="album-card" 
                  (click)="onAlbumClick(album.id)">
          <img [src]="getImageUrl(album.imageUrl)" alt="Album cover">
          <mat-card-content>
            <h3>{{album.title}}</h3>
            <p>{{album.artist}}</p>
            <p class="album-info">
              <span class="category">{{album.category}}</span>
              <span class="genre">{{album.genre}}</span>
              <span class="year">{{album.releaseDate | date:'yyyy'}}</span>
            </p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" 
                    [disabled]="!album.songs || album.songs.length === 0"
                    (click)="playAlbum(album); $event.stopPropagation()">
              <mat-icon>
                {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'pause' : 'play_arrow'}}
              </mat-icon>
              {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'Pause' : 'Play'}}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && albums.length === 0">
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
      padding: 20px;
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

    .albums-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    mat-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    mat-card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class UserLibraryComponent implements OnInit {
  albums: Album[] = [];
  currentAlbumId: string | null = null;
  isPlaying$ = this.store.select(selectIsPlaying);
  currentTrack$ = this.store.select(selectCurrentTrack);
  canSkipNext$ = this.store.select(selectCanSkipNext);
  canSkipPrevious$ = this.store.select(selectCanSkipPrevious);

  filteredAlbums: Album[] = [];
  filterForm: FormGroup;
  isLoading = false;
  categories: CategoryEnum[] = [];
  genres: GenreEnum[] = [];
  years: number[] = [];
  favorites: Set<string> = new Set();

  constructor(
    private store: Store<AppState>,
    private albumService: AlbumService,
    private songService: SongService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private enumService: EnumService,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
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
    this.currentTrack$.subscribe(track => {
      this.currentAlbumId = track?.albumId || null;
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
    this.albumService.getAlbums().subscribe(response => {
      if (response.success && response.data) {
        console.log('Raw album data:', response.data.content[0]);
        
        // For each album, fetch its songs if it has songIds
        const albumsWithSongs$ = response.data.content.map(album => {
          if (album.songIds && album.songIds.length > 0) {
            // Fetch songs for this album
            return forkJoin(
              album.songIds.map(id => this.songService.getSongById(id))
            ).pipe(
              map(songs => ({
                ...album,
                songs: songs.filter(s => s !== null) // Filter out any failed song fetches
              }))
            );
          }
          return of({ ...album, songs: [] });
        });

        // Wait for all song fetches to complete
        forkJoin(albumsWithSongs$).subscribe(albums => {
          this.albums = albums;
          console.log('Processed albums with songs:', this.albums);
          this.applyFilters();
        });
      }
      this.isLoading = false;
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

  playAlbum(album: Album): void {
    if (album.songs && album.songs.length > 0) {
      if (this.isCurrentAlbum(album)) {
        // If it's the current album, toggle play/pause
        this.store.dispatch(PlayerActions.togglePlay());
      } else {
        // If it's a different album, start playing it
      this.store.dispatch(PlayerActions.playAlbum({ 
        album: {
          ...album,
          songs: album.songs as Song[]
        }
      }));
      }
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

  onAlbumClick(albumId: string) {
    this.router.navigate(['/user/albums', albumId]);
  }
} 