import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UserActions } from '../../../store/user/user.actions';
import { selectUserProfile, selectUserLoading, selectUserError } from '../../../store/user/user.selectors';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-card *ngIf="profile$ | async as profile">
      <mat-card-header>
        <mat-card-title>Profile</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading$ | async" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
        
        <div *ngIf="error$ | async as error" class="error-message">
          {{ error }}
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Username</mat-label>
            <input matInput formControlName="username">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput formControlName="email">
          </mat-form-field>

          <mat-form-field>
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>

          <div class="avatar-section">
            <img [src]="profile.avatarUrl || 'assets/default-avatar.png'" alt="Profile avatar">
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*">
            <button mat-raised-button color="primary" (click)="fileInput.click()">
              Change Avatar
            </button>
          </div>

          <button mat-raised-button color="primary" type="submit" [disabled]="!profileForm.valid">
            Save Changes
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .error-message {
      color: red;
      margin: 10px 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
      }

      input[type="file"] {
        display: none;
      }
    }
  `]
})
export class UserProfileComponent implements OnInit {
  profile$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  profileForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    this.profile$ = this.store.select(selectUserProfile);
    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);

    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadProfile());

    this.profile$.subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.store.dispatch(UserActions.updateProfile({
        user: this.profileForm.value
      }));
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      this.store.dispatch(UserActions.updateAvatar({ formData }));
    }
  }
} 