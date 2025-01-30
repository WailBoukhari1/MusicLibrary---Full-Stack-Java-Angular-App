import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p class="mb-4">The page you're looking for doesn't exist.</p>
      <a routerLink="/" class="text-blue-500 hover:text-blue-700">Return Home</a>
    </div>
  `
})
export class NotFoundComponent {} 