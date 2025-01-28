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
import { forkJoin, of, BehaviorSubject, Observable, Subject, from } from 'rxjs';
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
} from '../../../store/player/player.selectors';
import { selectAllSongs } from '../../../store/song/song.selectors';
import { PlayerActions } from '../../../store/player/player.actions';
import { Song } from '../../../core/models/song.model';
import { SongService } from '../../../core/services/song.service';
import { AppState } from '../../../store/app.state';
import * as SongActions from '../../../store/song/song.actions';

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
  templateUrl:"user-library.component.html"

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
  songs$ = this.store.select(selectAllSongs);
  isPlaying$ = this.store.select(selectIsPlaying);
  currentSong$ = this.store.select(selectCurrentSong);
  currentSongId: string | null = null;

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
    this.store.dispatch(SongActions.loadSongs({ page: 0, size: 100 }));
    
    this.currentSong$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(song => {
      this.currentSongId = song?.id ?? null;
    });
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
      verticalPosition: 'top',
      panelClass: ['mat-toolbar', 'mat-primary'] // Dark theme snackbar
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

  togglePlay(song: Song): void {
    if (this.isCurrentSong(song)) {
      this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
        if (isPlaying) {
          this.store.dispatch(PlayerActions.pause());
        } else {
          this.store.dispatch(PlayerActions.play({ song }));
        }
      });
    } else {
      this.store.dispatch(PlayerActions.play({ song }));
    }
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSongId === song.id;
  }

  viewAlbumDetails(album: Album): void {
    this.router.navigate(['/user/albums', album.id]);
  }
}