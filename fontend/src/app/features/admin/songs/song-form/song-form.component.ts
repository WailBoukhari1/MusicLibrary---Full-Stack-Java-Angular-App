import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../../core/services/song.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule
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
              <input matInput formControlName="title" required>
              <mat-error *ngIf="songForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
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

            <div class="file-upload">
              <label class="file-label">Audio File</label>
              <div class="file-input-container">
                <input type="file" 
                       (change)="onAudioFileSelected($event)" 
                       accept="audio/mp3,audio/wav,audio/ogg"
                       class="file-input" 
                       #audioFileInput>
                <button type="button" 
                        mat-stroked-button 
                        (click)="audioFileInput.click()">
                  Select Audio File
                </button>
                <span class="file-name" *ngIf="audioFile">{{audioFile.name}}</span>
                <span class="file-name" *ngIf="songForm.get('audioFileId')?.value && !audioFile">
                  Current audio file exists
                </span>
              </div>
            </div>

            <div class="file-upload">
              <label class="file-label">Cover Image</label>
              <div class="file-input-container">
                <input type="file" 
                       (change)="onImageFileSelected($event)" 
                       accept="image/*"
                       class="file-input" 
                       #imageFileInput>
                <button type="button" 
                        mat-stroked-button 
                        (click)="imageFileInput.click()">
                  Select Image
                </button>
                
                <div class="image-preview" *ngIf="imagePreview || currentImageUrl">
                  <img [src]="imagePreview || currentImageUrl" 
                       alt="Cover preview">
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      [disabled]="songForm.invalid">
                {{isEditing ? 'Update' : 'Create'}}
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

    .file-upload {
      margin-bottom: 20px;
    }

    .file-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .file-input-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .file-input {
      display: none;
    }

    .file-name {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.87);
    }

    .image-preview {
      width: 128px;
      height: 128px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class SongFormComponent implements OnInit {
  songForm: FormGroup;
  isEditing = false;
  songId?: string;
  audioFile?: File;
  imageFile?: File;
  imagePreview?: string;
  currentImageUrl?: string;

  constructor(
    private fb: FormBuilder,
    private songService: SongService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      trackNumber: [1, Validators.required],
      description: [''],
      audioFileId: [''],
      imageFileId: [''],
      albumId: ['']
    });
  }

  ngOnInit(): void {
    this.songId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.songId) {
      this.isEditing = true;
      this.loadSong();
    }
  }

  loadSong(): void {
    if (this.songId) {
      this.songService.getSongById(this.songId).subscribe(response => {
        if (response.success && response.data) {
          this.songForm.patchValue(response.data);
          if (response.data.imageFileId) {
            this.currentImageUrl = `${environment.apiUrl}/files/${response.data.imageFileId}`;
          }
        }
      });
    }
  }

  onAudioFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioFile = file;
      // Extract title from filename if title is empty
      if (!this.songForm.get('title')?.value) {
        const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        this.songForm.patchValue({ title });
      }
    }
  }

  onImageFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.songForm.valid) {
      const formData = new FormData();
      Object.keys(this.songForm.value).forEach(key => {
        if (this.songForm.value[key]) {
          formData.append(key, this.songForm.value[key]);
        }
      });

      if (this.audioFile) {
        formData.append('audioFile', this.audioFile);
      }
      if (this.imageFile) {
        formData.append('imageFile', this.imageFile);
      }

      const request = this.isEditing
        ? this.songService.updateSong(this.songId!, formData)
        : this.songService.createSong(formData);

      request.subscribe(() => {
        this.router.navigate(['/admin/songs']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/songs']);
  }
} 