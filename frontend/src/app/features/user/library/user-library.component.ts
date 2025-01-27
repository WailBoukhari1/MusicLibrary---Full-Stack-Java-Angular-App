import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { forkJoin, of, BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Album } from '../../../core/models/album.model';
import { AlbumService } from '../../../core/services/album.service';
import { CategoryEnum, GenreEnum, EnumMapper } from '../../../core/models/enums.model';
import { EnumService } from '../../../core/services/enum.service';
import { environment } from '../../../../environments/environment';
import { 
  selectCurrentSong,
  selectIsPlaying,
  selectVolume,
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
        <mat-card *ngFor="let album of (filteredAlbums$ | async)" 
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
                    [disabled]="!album.songs?.length"
                    (click)="playAlbum(album, $event)">
              <mat-icon>
                {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'pause' : 'play_arrow'}}
              </mat-icon>
              {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'Pause' : 'Play'}}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && (albums$ | async)?.length === 0">
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
export class UserLibraryComponent implements OnInit, OnDestroy {
  // State management
  private destroy$ = new Subject<void>();
  private albumsSubject = new BehaviorSubject<Album[]>([]);
  private filteredAlbumsSubject = new BehaviorSubject<Album[]>([]);
  
  albums$ = this.albumsSubject.asObservable();
  filteredAlbums$ = this.filteredAlbumsSubject.asObservable();
  isLoading = false;

  // Player state
  currentAlbumId: string | null = null;
  isPlaying$ = this.store.select(selectIsPlaying);
  currentSong$ = this.store.select(selectCurrentSong);

  // Form and filters
  filterForm!: FormGroup;
  categories: CategoryEnum[] = [];
  genres: GenreEnum[] = [];
  years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    private store: Store<AppState>,
    private albumService: AlbumService,
    private songService: SongService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private enumService: EnumService,
    private router: Router
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      search: [''],
      category: [''],
      genre: [''],
      year: ['']
    });
  }

  ngOnInit(): void {
    this.loadEnums();
    this.loadAlbums();
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    // Filter changes
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilters());

    // Current song tracking
    this.currentSong$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(song => {
      this.currentAlbumId = song?.albumId ?? null;
    });
  }

  private loadEnums(): void {
    forkJoin({
      categories: this.enumService.getCategories(),
      genres: this.enumService.getGenres()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.categories = response.categories.data ?? [];
      this.genres = response.genres.data ?? [];
    });
  }

  private loadAlbums(): void {
    this.isLoading = true;
    
    this.albumService.getAlbums().pipe(
      map(response => {
        if (!response.success || !response.data?.content) {
          throw new Error('Failed to load albums');
        }
        return response.data.content;
      }),
      switchMap(albums => {
        // Map each album to include its songs
        const albumsWithSongs$ = albums.map(album => {
          if (album.songs && album.songs.length > 0) {
            // Songs are already included in the response
            return of(album);
          }
          // If no songs in response, try to load them from songIds
          if (album.songIds?.length) {
            return forkJoin(
              album.songIds.map(id => this.songService.getSongById(id))
            ).pipe(
              map(songs => ({
                ...album,
                songs: songs.filter(song => song !== null)
              }))
            );
          }
          return of(album);
        });
        
        return forkJoin(albumsWithSongs$);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (albums) => {
        console.log('Loaded albums:', albums); // Debug log
        this.albumsSubject.next(albums);
        this.applyFilters(); // Apply initial filters
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading albums:', error); // Debug log
        this.showError('Failed to load albums');
        this.isLoading = false;
      }
    });
  }

  playAlbum(album: Album, event: Event): void {
    event.stopPropagation();
    
    if (!album.songs?.length) {
      this.showError('No songs available in this album');
      return;
    }

    this.store.dispatch(PlayerActions.playAlbum({ songs: album.songs }));
  }

  onAlbumClick(albumId: string): void {
    this.router.navigate(['/user/albums', albumId]);
  }

  isCurrentAlbum(album: Album): boolean {
    return this.currentAlbumId === album.id;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getCategoryDisplayName(name: string | null | undefined): string {
    return name ? EnumMapper.getDisplayName(this.categories, name) : '';
  }

  getGenreDisplayName(name: string | null | undefined): string {
    return name ? EnumMapper.getDisplayName(this.genres, name) : '';
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    return imageUrl ? 
      `${environment.apiUrl}/files/${imageUrl}` : 
      'assets/images/default-album.png';
  }

  private applyFilters(): void {
    const filters = this.filterForm.value;
    const albums = this.albumsSubject.value;
    
    console.log('Applying filters to albums:', albums); // Debug log
    
    const filtered = albums.filter(album => {
      const searchTerm = (filters.search || '').toLowerCase();
      const matchesSearch = !searchTerm || 
        album.title.toLowerCase().includes(searchTerm) ||
        album.artist.toLowerCase().includes(searchTerm);
        
      const matchesCategory = !filters.category || 
        album.category === (filters.category as unknown as CategoryEnum);
        
      const matchesGenre = !filters.genre || 
        album.genre === (filters.genre as unknown as GenreEnum);
        
      const matchesYear = !filters.year || 
        (album.releaseDate && 
         new Date(album.releaseDate).getFullYear() === Number(filters.year));

      return matchesSearch && matchesCategory && matchesGenre && matchesYear;
    });

    console.log('Filtered albums:', filtered); // Debug log
    this.filteredAlbumsSubject.next(filtered);
  }

  clearFilter(filterName: string) {
    this.filterForm.patchValue({ [filterName]: '' });
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterForm.value)
      .some(value => value !== '' && value !== null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 