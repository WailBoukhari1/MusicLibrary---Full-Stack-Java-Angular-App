import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Song } from '../../../../core/models/song.model';
import { Album } from '../../../../core/models/album.model';
import * as SongActions from '../../../../store/song/song.actions';
import * as SongSelectors from '../../../../store/song/song.selectors';
import * as AlbumActions from '../../../../store/album/album.actions';
import * as AlbumSelectors from '../../../../store/album/album.selectors';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl:"song-form.component.html"
})
export class SongFormComponent implements OnInit, OnDestroy {
  songForm!: FormGroup;
  isEditMode = false;
  songId: string | null = null;
  
  // File handling properties
  audioFile: File | null = null;
  imageFile: File | null = null;
  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;
  audioPreviewUrl?: SafeUrl;
  imagePreviewUrl?: SafeUrl;
  
  // Observables
  loading$ = this.store.select(SongSelectors.selectSongLoading);
  error$ = this.store.select(SongSelectors.selectSongError);
  success$ = this.store.select(SongSelectors.selectSongSuccess);
  albums$ = this.store.select(AlbumSelectors.selectAllAlbums);
  currentSong$ = this.store.select(SongSelectors.selectCurrentSong);
  
  private destroy$ = new Subject<void>();

  // Add these properties
  selectedAlbum: Album | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.songForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      artist: ['', [Validators.required, Validators.minLength(2)]],
      albumId: [null],
      trackNumber: [null],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Load albums when component initializes
    this.store.dispatch(AlbumActions.loadAlbums());

    // Get resolved data
    const resolvedSong = this.route.snapshot.data['song'];
    
    this.songId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.songId;

    if (resolvedSong) {
      this.patchFormValues(resolvedSong);
      this.setupPreviews(resolvedSong);
    }

    // Handle success/error
    this.success$
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/admin/songs']);
        }
      });

    // Add album selection handling
    this.songForm.get('albumId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(albumId => {
        if (albumId) {
          this.albums$.pipe(takeUntil(this.destroy$)).subscribe(albums => {
            this.selectedAlbum = albums.find(album => album.id === albumId) || null;
          });
        } else {
          this.selectedAlbum = null;
        }
        this.cdr.detectChanges();
      });
  }

  private patchFormValues(song: Song): void {
    this.songForm.patchValue({
      title: song.title,
      artist: song.artist,
      albumId: song.albumId,
      trackNumber: song.trackNumber,
      description: song.description
    });
  }

  private setupPreviews(song: Song): void {
    if (song.imageUrl) {
      this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        `${environment.apiUrl}/files/${song.imageFileId}`
      );
    }
    
    if (song.audioUrl) {
      this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        `${environment.apiUrl}/files/${song.audioFileId}`
      );
    }
    this.cdr.detectChanges();
  }

  onAudioFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioFile = file;
      this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
      this.selectedAudioFile = file;
      this.cdr.detectChanges();
    }
  }

  onImageFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
          reader.result as string
        );
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const formData = new FormData();
      const formValue = this.songForm.value;

      // Append form fields
      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });

      // Append files if selected
      if (this.audioFile) {
        formData.append('audioFile', this.audioFile);
      }
      if (this.imageFile) {
        formData.append('imageFile', this.imageFile);
      }

      // Dispatch appropriate action
      if (this.isEditMode && this.songId) {
        this.store.dispatch(SongActions.updateSong({ 
          id: this.songId, 
          song: formData 
        }));
      } else {
        this.store.dispatch(SongActions.createSong({ song: formData }));
      }
    }
  }
  getImageUrl(coverUrl: string | null | undefined): string {
    if (!coverUrl) return 'assets/default-songs.png';
    return `${environment.apiUrl}/files/${coverUrl}`;
  }
  onCancel(): void {
    this.router.navigate(['/admin/songs']);
  }

  ngOnDestroy(): void {
    if (this.audioPreviewUrl) {
      URL.revokeObjectURL(this.audioPreviewUrl as string);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 