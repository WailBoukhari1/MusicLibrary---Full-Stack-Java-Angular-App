import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AlbumActions } from '../../store/album.actions';
import { selectAlbumError, selectAlbumLoading } from '../../store/album.selectors';
import { Album } from '../../models/album.model';
import { CategoryEnum, GenreEnum } from '../../../../../core/models/enums';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Create' }} Album</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <div *ngIf="error$ | async as error" class="error-message">{{ error }}</div>

          <form [formGroup]="albumForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required #titleInput>
              <mat-error *ngIf="albumForm.get('title')?.invalid">
                {{ getErrorMessage('title') }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artist</mat-label>
              <input matInput formControlName="artist" required>
              <mat-error *ngIf="albumForm.get('artist')?.invalid">
                {{ getErrorMessage('artist') }}
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories" [value]="category.name">
                  {{category.displayName}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Genre</mat-label>
              <mat-select formControlName="genre" required>
                <mat-option *ngFor="let genre of genres" [value]="genre.name">
                  {{genre.displayName}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Release Date</mat-label>
              <input matInput type="date" formControlName="releaseDate" required>
            </mat-form-field>

            <div class="image-upload">
              <input type="file" (change)="onFileSelected($event)" accept="image/*">
              <div class="image-preview" *ngIf="imagePreview || currentImageUrl">
                <img [src]="imagePreview || currentImageUrl" alt="Album cover preview">
              </div>
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="albumForm.invalid || (loading$ | async)">
                <mat-spinner diameter="20" *ngIf="loading$ | async"></mat-spinner>
                <span>{{ isEditMode ? 'Update' : 'Create' }}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    .image-upload {
      margin: 1rem 0;
    }
    .error-message {
      color: #f44336;
      padding: 1rem;
      margin-bottom: 1rem;
      background-color: #ffebee;
      border-radius: 4px;
    }
    .image-preview {
      margin-top: 1rem;
      max-width: 200px;
    }
    .image-preview img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class AlbumFormComponent implements OnInit, OnDestroy, AfterViewInit {
  albumForm!: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentImageUrl: string | null = null;
  categories: CategoryEnum[] = [];
  genres: GenreEnum[] = [];
  loading$ = this.store.select(selectAlbumLoading);
  error$ = this.store.select(selectAlbumError);
  private destroy$ = new Subject<void>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {
    this.initForm();
  }

  private initForm() {
    this.albumForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      artist: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      category: ['', Validators.required],
      genre: ['', Validators.required],
      releaseDate: ['', [
        Validators.required,
        this.dateValidator()
      ]]
    });
  }

  private dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const date = new Date(control.value);
      const now = new Date();
      return date > now ? { futureDate: true } : null;
    };
  }

  // Add error messages to template
  getErrorMessage(controlName: string): string {
    const control = this.albumForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) return 'Input is too short';
    if (control.hasError('maxlength')) return 'Input is too long';
    if (control.hasError('futureDate')) return 'Release date cannot be in the future';
    return '';
  }

  ngOnInit() {
    // Combine both data subscriptions into one
    this.route.data.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle enums
      if (data['enums']) {
        this.categories = data['enums'].categories;
        this.genres = data['enums'].genres;
      }

      // Handle album data for edit mode
      if (data['albumData']?.success && data['albumData'].data) {
        this.isEditMode = true;
        const album = data['albumData'].data;
        this.albumForm.patchValue({
          title: album.title,
          artist: album.artist,
          category: album.category,
          genre: album.genre,
          releaseDate: new Date(album.releaseDate).toISOString().split('T')[0]
        });
        if (album.coverUrl) {
          this.currentImageUrl = `${environment.apiUrl}/files/images/${album.coverUrl}`;
        }
      }
    });

    // Handle store subscriptions
    this.loading$ = this.store.select(selectAlbumLoading);
    this.error$ = this.store.select(selectAlbumError);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.store.dispatch(AlbumActions.setError({ 
          error: 'Please select a valid image file' 
        }));
      }
    }
  }

  onSubmit() {
    if (this.albumForm.valid) {
      const formData = new FormData();
      Object.keys(this.albumForm.value).forEach(key => {
        formData.append(key, this.albumForm.value[key]);
      });
      
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }

      if (this.isEditMode) {
        const albumId = this.route.snapshot.paramMap.get('id');
        if (albumId) {
          this.store.dispatch(AlbumActions.updateAlbum({ id: albumId, album: formData }));
        }
      } else {
        this.store.dispatch(AlbumActions.createAlbum({ album: formData }));
      }
    } else {
      this.markFormGroupTouched(this.albumForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/albums']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    // Focus first input on init
    setTimeout(() => this.titleInput.nativeElement.focus(), 0);
  }
} 