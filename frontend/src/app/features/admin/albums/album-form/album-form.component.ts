import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { EnumService } from '../../../../core/services/enum.service';
import { EnumValue } from '../../../../core/models/enums.model';
import { environment } from '../../../../../environments/environment';
import * as AlbumActions from '../../../../store/album/album.actions';
import * as AlbumSelectors from '../../../../store/album/album.selectors';
import { Album } from '../../../../core/models/album.model';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit' : 'Create' }} Album</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="albumForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" required>
              <mat-error *ngIf="albumForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Artist</mat-label>
              <input matInput formControlName="artist" required>
              <mat-error *ngIf="albumForm.get('artist')?.hasError('required')">
                Artist is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Release Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="releaseDate" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="albumForm.get('releaseDate')?.hasError('required')">
                Release date is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories" [value]="category.name">
                  {{ category.displayName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="albumForm.get('category')?.hasError('required')">
                Category is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Genre</mat-label>
              <mat-select formControlName="genre" required>
                <mat-option *ngFor="let genre of genres" [value]="genre.name">
                  {{ genre.displayName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="albumForm.get('genre')?.hasError('required')">
                Genre is required
              </mat-error>
            </mat-form-field>

            <div class="file-input-group">
              <button type="button" mat-raised-button (click)="imageFileInput.click()">
                <mat-icon>image</mat-icon>
                {{ isEditMode ? 'Change' : 'Upload' }} Cover Image
              </button>
              <input #imageFileInput 
                     type="file" 
                     (change)="onFileSelected($event)" 
                     accept="image/*" 
                     style="display: none">
              <span class="file-name" *ngIf="imageFile">
                {{imageFile.name}}
              </span>
            </div>

            <div class="image-preview" *ngIf="imagePreview">
              <img [src]="imagePreview" alt="Album cover preview">
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      [disabled]="albumForm.invalid">
                {{ isEditMode ? 'Update' : 'Create' }} Album
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

    .file-input-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .image-preview {
      width: 200px;
      height: 200px;
      border-radius: 4px;
      overflow: hidden;
      margin: 16px 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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
export class AlbumFormComponent implements OnInit, OnDestroy {
  albumForm!: FormGroup;
  isEditMode = false;
  albumId: string | null = null;
  imagePreview: SafeUrl | null = null;
  imageFile: File | null = null;
  categories: EnumValue[] = [];
  genres: EnumValue[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private enumService: EnumService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
    this.loadEnums();
  }

  private initializeForm(): void {
    this.albumForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      artist: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      releaseDate: ['', Validators.required],
      category: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  private loadEnums(): void {
    this.enumService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => this.categories = response.data ?? []);
      
    this.enumService.getGenres()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => this.genres = response.data ?? []);
  }

  ngOnInit(): void {
    this.albumId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.albumId;

    if (this.isEditMode && this.albumId) {
      this.store.select(AlbumSelectors.selectAlbumById(this.albumId))
        .pipe(takeUntil(this.destroy$))
        .subscribe(album => {
          if (album) {
            this.albumForm.patchValue({
              title: album.title,
              artist: album.artist,
              releaseDate: album.releaseDate ? new Date(album.releaseDate) : new Date(),
              category: album.category,
              genre: album.genre
            });

            if (album.imageUrl) {
              this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(
                `${environment.apiUrl}/files/${album.imageUrl}`
              );
              this.cdr.detectChanges();
            }
          }
        });
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.albumForm.valid) {
      const formData = new FormData();
      const formValue = this.albumForm.value;

      Object.keys(formValue).forEach(key => {
        if (key === 'releaseDate') {
          formData.append(key, formValue[key].toISOString().split('T')[0]);
        } else {
          formData.append(key, formValue[key]);
        }
      });

      if (this.imageFile) {
        formData.append('imageFile', this.imageFile);
      }

      if (this.isEditMode && this.albumId) {
        this.store.dispatch(AlbumActions.updateAlbum({ id: this.albumId, album: formData }));
      } else {
        this.store.dispatch(AlbumActions.createAlbum({ album: formData }));
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
