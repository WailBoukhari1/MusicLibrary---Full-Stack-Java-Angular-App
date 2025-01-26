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
import { selectSongsLoading, selectSongsError } from '../../../../store/song/song.selectors';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';

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
    MatProgressBarModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Create'}} Song</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="songForm" (ngSubmit)="onSubmit()" class="form-content">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" [readonly]="true">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artist</mat-label>
              <input matInput formControlName="artist" required>
              <mat-error *ngIf="songForm.get('artist')?.hasError('required')">
                Artist is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Track Number</mat-label>
              <input matInput type="number" formControlName="trackNumber" required>
              <mat-error *ngIf="songForm.get('trackNumber')?.hasError('required')">
                Track number is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Album</mat-label>
              <mat-select formControlName="albumId" required>
                <mat-option [value]="null">None</mat-option>
                <mat-option *ngFor="let album of albums" [value]="album.id">
                  {{album.title}} - {{album.artist}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="songForm.get('albumId')?.hasError('required')">
                Album is required
              </mat-error>
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
                  Select Audio File
                </button>
                <span class="file-name" *ngIf="selectedAudioFile">
                  {{selectedAudioFile.name}}
                </span>
                <input #audioFileInput type="file" (change)="onAudioFileSelected($event)" 
                       accept="audio/*" style="display: none">
              </div>

              <div class="file-input-group">
                <button type="button" mat-raised-button (click)="imageFileInput.click()">
                  Select Cover Image
                </button>
                <span class="file-name" *ngIf="selectedImageFile">
                  {{selectedImageFile.name}}
                </span>
                <input #imageFileInput type="file" (change)="onImageFileSelected($event)" 
                       accept="image/*" style="display: none">
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit"
                      [disabled]="!canSubmit()">
                {{isEditing ? 'Update' : 'Create'}} Song
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
  songForm: FormGroup;
  isEditing = false;
  songId?: number;
  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl?: SafeUrl;
  audioPreviewUrl?: SafeUrl;
  albums: Album[] = [];
  loading$ = this.store.select(selectSongsLoading);
  error$ = this.store.select(selectSongsError);
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
    this.songForm = this.fb.group({
      title: [''],
      artist: ['', Validators.required],
      trackNumber: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      albumId: [null],
      audioFileId: [''],
      imageFileId: [''],
      category: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAlbums();
    const idParam = this.route.snapshot.paramMap.get('id');
    this.songId = idParam ? +idParam : undefined;
    if (this.songId) {
      this.isEditing = true;
      this.loadSong();
    }
  }

  loadAlbums() {
    this.albumService.getAlbums(0, 1000).subscribe({
      next: (response) => {
        if (response?.success && response?.data) {
          this.albums = response.data.content;
        }
      },
      error: (error) => console.error('Error loading albums:', error)
    });
  }

  loadSong(): void {
    this.songService.getSongById(this.songId!).subscribe({
      next: (response) => {
        if (response.data) {
          this.songForm.patchValue(response.data);
          if (response.data.imageFileId) {
            this.imagePreviewUrl = `${environment.apiUrl}/files/${response.data.imageFileId}`;
          }
          if (response.data.audioFileId) {
            this.audioPreviewUrl = `${environment.apiUrl}/files/${response.data.audioFileId}`;
          }
        }
      },
      error: (error) => console.error('Error loading song:', error)
    });
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
          trackNumber: this.songForm.get('trackNumber')?.value || 1
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
    if (this.canSubmit()) {
      const formData = new FormData();
      formData.append('title', this.songForm.get('title')?.value);
      formData.append('artist', this.songForm.get('artist')?.value);
      formData.append('trackNumber', this.songForm.get('trackNumber')?.value);
      formData.append('audioFile', this.selectedAudioFile!);
      
      if (this.selectedImageFile) {
        formData.append('imageFile', this.selectedImageFile);
      }

      this.store.dispatch(SongActions.createSong({ song: formData }));
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/songs']);
  }

  canSubmit(): boolean {
    const artistValid = this.songForm.get('artist')?.valid ?? false;
    const trackNumberValid = this.songForm.get('trackNumber')?.valid ?? false;
    return artistValid && trackNumberValid && !!this.selectedAudioFile;
  }

  ngOnDestroy(): void {
    if (this.audioPreviewUrl) {
      URL.revokeObjectURL(this.audioPreviewUrl as string);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 