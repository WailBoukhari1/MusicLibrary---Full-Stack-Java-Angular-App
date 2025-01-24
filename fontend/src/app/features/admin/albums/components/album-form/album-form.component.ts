import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Album } from '../../../../../core/models/album.model';
import { AlbumActions } from '../../store/album.actions';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EnumService } from '../../../../../core/services/enum.service';
import { map, tap, finalize, catchError } from 'rxjs/operators';
import { CategoryEnum, GenreEnum, EnumMapper } from '../../../../../core/models/enums';
import { DateFormatPipe } from '../../../../../core/pipes/date-format.pipe';

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
    DateFormatPipe
  ],
  template: `
    <div class="container">
      <h2>{{ isEditing ? 'Edit Album' : 'Create New Album' }}</h2>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>

      <form [formGroup]="albumForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Artist</mat-label>
          <input matInput formControlName="artist" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Release Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="releaseDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category" required>
            <mat-option *ngIf="loading">Loading...</mat-option>
            <mat-option *ngFor="let category of categories$ | async" [value]="category.name">
              {{category.displayName}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Genre</mat-label>
          <mat-select formControlName="genre" required>
            <mat-option *ngIf="loading">Loading...</mat-option>
            <mat-option *ngFor="let genre of genres$ | async" [value]="genre.name">
              {{genre.displayName}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="image-upload">
          <input type="file" (change)="onFileSelected($event)" accept="image/*">
          <img *ngIf="imagePreview" [src]="imagePreview" alt="Preview">
        </div>

        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!albumForm.valid">
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
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
      gap: 16px;
    }
    .image-upload {
      margin: 16px 0;
    }
    .image-upload img {
      max-width: 200px;
      margin-top: 8px;
    }
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
    .error-message {
      color: red;
      margin-bottom: 16px;
      padding: 8px;
      background-color: #fff2f2;
      border-radius: 4px;
    }
  `]
})
export class AlbumFormComponent implements OnInit {
  albumForm: FormGroup;
  isEditing = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  loading = false;
  error: string | null = null;
  categories$ = this.enumService.getCategories().pipe(
    tap(() => this.loading = true),
    map(response => response.data || []),
    catchError(error => {
      this.error = error.message;
      return [];
    }),
    finalize(() => this.loading = false)
  );
  genres$ = this.enumService.getGenres().pipe(
    tap(() => this.loading = true),
    map(response => response.data || []),
    catchError(error => {
      this.error = error.message;
      return [];
    }),
    finalize(() => this.loading = false)
  );
  categories: CategoryEnum[] = [];
  genres: GenreEnum[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store<{ album: { selectedAlbum: Album | null } }>,
    private router: Router,
    private route: ActivatedRoute,
    private enumService: EnumService,
    private dateFormatPipe: DateFormatPipe
  ) {
    this.albumForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      releaseDate: [null, Validators.required],
      category: ['', Validators.required],
      genre: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get resolved enums
    this.route.data.subscribe(data => {
      this.categories = data['enums'].categories;
      this.genres = data['enums'].genres;
    });

    // If editing, get resolved album
    if (this.isEditing) {
      this.store.select(state => state.album.selectedAlbum)
        .subscribe(album => {
          if (album) {
            this.albumForm.patchValue(album);
          }
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.albumForm.valid) {
      const formData = new FormData();
      const formValue = this.albumForm.value;
      
      formData.append('title', formValue.title);
      formData.append('artist', formValue.artist);
      formData.append('releaseDate', this.dateFormatPipe.transform(formValue.releaseDate));
      formData.append('category', formValue.category);
      formData.append('genre', formValue.genre);
      
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }

      if (this.isEditing) {
        this.store.select(state => state.album.selectedAlbum).subscribe(album => {
          if (album) {
            this.store.dispatch(AlbumActions.updateAlbum({
              id: album.id,
              album: formData
            }));
            this.router.navigate(['/admin/albums']);
          }
        }).unsubscribe();
      } else {
        this.store.dispatch(AlbumActions.createAlbum({ album: formData }));
        this.router.navigate(['/admin/albums']);
      }
    }
  }

  onCancel() {
    this.router.navigate(['/admin/albums']);
  }
} 