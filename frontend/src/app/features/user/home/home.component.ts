import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 md:p-8">
      <div class="max-w-7xl mx-auto space-y-16">
        <!-- Hero Section -->
        <div class="text-center py-16 md:py-24 space-y-8 bg-white rounded-2xl shadow-sm px-6 md:px-12">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">Welcome to Music Library</h1>
          <p class="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">Your personal music collection, organized and accessible anytime.</p>
          <div class="flex flex-wrap justify-center gap-6 mt-12">
            <button mat-raised-button color="primary" routerLink="/user/albums"
                    class="!px-8 !py-3 !text-lg !rounded-full flex items-center gap-3 !font-medium hover:!shadow-lg transition-shadow">
              <mat-icon>library_music</mat-icon>
              Browse Albums
            </button>
            <button mat-raised-button color="accent" routerLink="/user/favorites"
                    class="!px-8 !py-3 !text-lg !rounded-full flex items-center gap-3 !font-medium hover:!shadow-lg transition-shadow">
              <mat-icon>favorite</mat-icon>
              Favorites
            </button>
          </div>
        </div>

        <!-- Features Section -->
        <div class="space-y-12">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <mat-card class="feature-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-header class="!pb-6">
                <mat-icon mat-card-avatar class="!text-primary !w-12 !h-12 !text-3xl">library_music</mat-icon>
                <mat-card-title class="!text-xl !font-bold !mt-2">Music Library</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed">Manage and organize your music seamlessly.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-header class="!pb-6">
                <mat-icon mat-card-avatar class="!text-primary !w-12 !h-12 !text-3xl">playlist_add</mat-icon>
                <mat-card-title class="!text-xl !font-bold !mt-2">Create Playlists</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed">Curate playlists tailored to your mood.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-header class="!pb-6">
                <mat-icon mat-card-avatar class="!text-primary !w-12 !h-12 !text-3xl">search</mat-icon>
                <mat-card-title class="!text-xl !font-bold !mt-2">Smart Search</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed">Find any song instantly with our intelligent search.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-header class="!pb-6">
                <mat-icon mat-card-avatar class="!text-primary !w-12 !h-12 !text-3xl">devices</mat-icon>
                <mat-card-title class="!text-xl !font-bold !mt-2">Cross Platform</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p class="text-gray-600 leading-relaxed">Access your music from any device, anywhere.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Why Choose Us Section -->
        <div class="space-y-12 pb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900">Why Choose Us?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <mat-card class="why-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-content class="!p-8">
                <mat-icon class="!text-primary !mb-4 !w-12 !h-12 !text-3xl">touch_app</mat-icon>
                <h3 class="text-2xl font-bold mb-4 text-gray-800">Seamless Experience</h3>
                <p class="text-gray-600 leading-relaxed">Enjoy an intuitive and user-friendly interface.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="why-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-content class="!p-8">
                <mat-icon class="!text-primary !mb-4 !w-12 !h-12 !text-3xl">block</mat-icon>
                <h3 class="text-2xl font-bold mb-4 text-gray-800">Ad-Free Listening</h3>
                <p class="text-gray-600 leading-relaxed">Enjoy your music without interruptions.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="why-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <mat-card-content class="!p-8">
                <mat-icon class="!text-primary !mb-4 !w-12 !h-12 !text-3xl">recommend</mat-icon>
                <h3 class="text-2xl font-bold mb-4 text-gray-800">Personalized Recommendations</h3>
                <p class="text-gray-600 leading-relaxed">Discover new music based on your tastes.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
