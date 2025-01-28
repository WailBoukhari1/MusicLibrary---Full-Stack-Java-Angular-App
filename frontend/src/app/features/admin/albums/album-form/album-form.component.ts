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
  templateUrl:"album-form.component.html"
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