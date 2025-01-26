import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../../core/services/song.service';
import { AlbumService } from '../../../../core/services/album.service';
import { Album } from '../../../../core/models/album.model';
import { environment } from '../../../../../environments/environment';
import { Store } from '@ngrx/store';
import { SongActions } from '../../../../store/song/song.actions';
import { selectSongsLoading, selectSongsError, selectSelectedSong } from '../../../../store/song/song.selectors';
import { selectAllAlbums } from '../../../../store/album/album.selectors';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { AlbumActions } from '../../../../store/album/album.actions';
import { MatIconModule } from '@angular/material/icon';

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
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Create' }} Song</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="songForm" (ngSubmit)="onSubmit()" class="form-content">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artist</mat-label>
              <input matInput formControlName="artist" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Genre</mat-label>
              <input matInput formControlName="genre" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Track Number</mat-label>
              <input matInput type="number" formControlName="trackNumber">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Album</mat-label>
              <mat-select formControlName="albumId">
                <mat-option [value]="null">None</mat-option>
                <mat-option *ngFor="let album of albums$ | async" [value]="album.id">
                  {{album.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="preview-section">
              <div class="image-preview" *ngIf="imagePreviewUrl">
                <img [src]="imagePreviewUrl" alt="Cover preview">
              </div>

              <div class="audio-preview" *ngIf="audioPreviewUrl">
                <audio controls [src]="audioPreviewUrl">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>

            <div class="file-inputs">
              <div class="file-input-group">
                <button type="button" mat-raised-button (click)="audioFileInput.click()">
                  <mat-icon>audiotrack</mat-icon>
                  {{ isEditMode ? 'Change' : 'Upload' }} Audio File
                </button>
                <span class="file-name" *ngIf="selectedAudioFile">
                  {{selectedAudioFile.name}}
                </span>
                <input #audioFileInput type="file" (change)="onAudioFileSelected($event)" 
                       accept="audio/*" style="display: none">
              </div>

              <div class="file-input-group">
                <button type="button" mat-raised-button (click)="imageFileInput.click()">
                  <mat-icon>image</mat-icon>
                  {{ isEditMode ? 'Change' : 'Upload' }} Cover Image
                </button>
                <span class="file-name" *ngIf="selectedImageFile">
                  {{selectedImageFile.name}}
                </span>
                <input #imageFileInput type="file" (change)="onImageFileSelected($event)" 
                       accept="image/*" style="display: none">
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="songForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Song
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-card {
      margin-bottom: 20px;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    .file-inputs {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    .preview-section {
      display: flex;
      gap: 20px;
      margin: 20px 0;
    }

    .image-preview {
      width: 200px;
      height: 200px;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .audio-preview {
      flex: 1;
      min-width: 0;
    }

    .audio-preview audio {
      width: 100%;
    }

    .file-input-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .file-name {
      color: rgba(0,0,0,0.6);
      font-size: 14px;
    }
  `]
})
export class SongFormComponent implements OnInit, OnDestroy {
  songForm = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    artist: ['', Validators.required],
    genre: ['', Validators.required],
    trackNumber: [null as number | null],
    description: [''],
    albumId: [null as string | null],
    audioFile: [null],
    imageFile: [null]
  });

  isEditMode = false;
  song$ = this.store.select(selectSelectedSong);
  albums$ = this.store.select(selectAllAlbums) as Observable<Album[]>;
  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl?: SafeUrl;
  audioPreviewUrl?: SafeUrl;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
  }

  ngOnInit(): void {
    // Load albums for the dropdown
    this.store.dispatch(AlbumActions.loadAlbums({ page: 0, size: 100 }));

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.store.dispatch(SongActions.getSongById({ id }));

      // Subscribe to song data and fill the form
      this.song$.pipe(
        filter((song): song is NonNullable<typeof song> => !!song),
        take(1)
      ).subscribe(song => {
        // Update form with song data
        this.songForm.patchValue({
          id: song.id,
          title: song.title,
          artist: song.artist,
          trackNumber: song.trackNumber,
          description: song.description,
          albumId: song.albumId
        });

        // Set preview URLs if available
        if (song.imageFileId) {
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `${environment.apiUrl}/files/${song.imageFileId}`
          );
        }

        if (song.audioFileId) {
          this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `${environment.apiUrl}/files/${song.audioFileId}`
          );
        }

        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
  }

  onAudioFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ngZone.run(() => {
        this.selectedAudioFile = file;
        
        // Set title from filename and mark as valid
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        this.songForm.patchValue({ 
          title: fileName,
          artist: this.songForm.get('artist')?.value || '',
          genre: this.songForm.get('genre')?.value || ''
        });

        // Create audio preview
        const blobUrl = URL.createObjectURL(file);
        this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
        
        this.cdr.detectChanges();
      });
    }
  }

  onImageFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ngZone.run(() => {
        this.selectedImageFile = file;
        
        // Create safe image preview URL
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
          
          // Manually trigger change detection
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const formData = new FormData();
      const controls = this.songForm.controls;

      formData.append('title', controls.title.value || '');
      formData.append('artist', controls.artist.value || '');
      formData.append('genre', controls.genre.value || '');
      
      if (controls.trackNumber.value) {
        formData.append('trackNumber', controls.trackNumber.value.toString());
      }
      
      if (controls.description.value) {
        formData.append('description', controls.description.value);
      }
      
      if (controls.albumId.value) {
        formData.append('albumId', controls.albumId.value);
      }
      
      if (this.selectedAudioFile) {
        formData.append('audioFile', this.selectedAudioFile);
      }

      if (this.selectedImageFile) {
        formData.append('imageFile', this.selectedImageFile);
      }

      if (this.isEditMode) {
        const id = controls.id.value;
        if (id) {
          this.store.dispatch(SongActions.updateSong({ id, song: formData }));
        }
      } else {
        this.store.dispatch(SongActions.createSong({ song: formData }));
      }
    }
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