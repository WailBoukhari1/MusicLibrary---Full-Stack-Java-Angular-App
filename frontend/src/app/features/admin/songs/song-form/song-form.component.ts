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
import { SongActions } from '../../../../store/song/song.actions';
import { AlbumActions } from '../../../../store/album/album.actions';
import { selectAllAlbums } from '../../../../store/album/album.selectors';
import { selectSongsLoading, selectSongsSuccess } from '../../../../store/song/song.selectors';
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
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Create' }} Song</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="songForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="songForm.get('title')?.errors?.['required']">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artist</mat-label>
              <input matInput formControlName="artist" required>
              <mat-error *ngIf="songForm.get('artist')?.errors?.['required']">
                Artist is required
              </mat-error>
</mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Album</mat-label>
              <mat-select formControlName="albumId">
                <mat-option [value]="null">No Album</mat-option>
                <mat-option *ngFor="let album of albums$ | async" [value]="album.id">
                  {{album.title}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Track Number</mat-label>
              <input matInput type="number" formControlName="trackNumber">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <div class="file-inputs">
              <div class="file-input-group">
                <button type="button" mat-raised-button (click)="audioFileInput.click()">
                  <mat-icon>audiotrack</mat-icon>
                  {{ isEditMode ? 'Change' : 'Upload' }} Audio File
                </button>
                <input #audioFileInput type="file" (change)="onAudioFileSelected($event)" 
                       accept="audio/*" style="display: none">
                <span class="file-name" *ngIf="selectedAudioFile">
                  {{selectedAudioFile.name}}
                </span>
              </div>

              <div class="file-input-group">
                <button type="button" mat-raised-button (click)="imageFileInput.click()">
                  <mat-icon>image</mat-icon>
                  {{ isEditMode ? 'Change' : 'Upload' }} Cover Image
                </button>
                <input #imageFileInput type="file" (change)="onImageFileSelected($event)" 
                       accept="image/*" style="display: none">
                <span class="file-name" *ngIf="selectedImageFile">
                  {{selectedImageFile.name}}
                </span>
              </div>
            </div>

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

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="songForm.invalid || (loading$ | async)">
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

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .file-inputs {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .file-input-group {
      display: flex;
      align-items: center;
      gap: 12px;
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }

    .file-name {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
  `]
})
export class SongFormComponent implements OnInit, OnDestroy {
  songForm = this.fb.group({
    title: ['', Validators.required],
    artist: ['', Validators.required],
    genre: ['', Validators.required],
    albumId: [null as string | null],
    trackNumber: [null as number | null],
    description: ['']
  });
  isEditMode = false;
  song: Song | null = null;
  loading$ = this.store.select(selectSongsLoading);
  albums$ = this.store.select(selectAllAlbums);
  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl?: SafeUrl;
  audioPreviewUrl?: SafeUrl;
  private destroy$ = new Subject<void>();
  private submitted = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AlbumActions.loadAlbums({ page: 0, size: 100 }));

    console.log('Form component initialized');
    
    this.route.data.subscribe(data => {
      console.log('Route data received:', data);
      this.song = data['song'];
      this.isEditMode = !!this.song;
      console.log('Is edit mode:', this.isEditMode);
      console.log('Song data:', this.song);
      
      if (this.song) {
        this.songForm.patchValue({
          title: this.song.title,
          artist: this.song.artist,
          albumId: this.song.albumId,
          trackNumber: this.song.trackNumber,
          description: this.song.description
        });

        if (this.song.imageFileId) {
          this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `${environment.apiUrl}/files/${this.song.imageFileId}`
          );
        }

        if (this.song.audioFileId) {
          this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `${environment.apiUrl}/files/${this.song.audioFileId}`
          );
        }
      }
    });

    this.store.select(selectSongsSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success && this.submitted) {
          this.router.navigate(['/admin/songs']);
        }
      });
  }

  onAudioFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedAudioFile = file;
      this.audioPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.cdr.detectChanges();
    }
  }

  onImageFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      this.submitted = true;
      const formData = new FormData();
      const formValue = this.songForm.value;

      Object.keys(formValue).forEach(key => {
        const value = formValue[key as keyof typeof formValue];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (this.selectedAudioFile) {
        formData.append('audioFile', this.selectedAudioFile);
      }

      if (this.selectedImageFile) {
        formData.append('imageFile', this.selectedImageFile);
      }

      if (this.isEditMode && this.song?.id) {
        this.store.dispatch(SongActions.updateSong({ 
          id: this.song.id, 
          song: formData 
        }));
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