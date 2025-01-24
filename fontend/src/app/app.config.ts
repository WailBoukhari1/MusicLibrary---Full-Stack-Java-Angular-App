import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { albumReducer } from './features/admin/albums/store/album.reducer';
import { AlbumEffects } from './features/admin/albums/store/album.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({ 
      auth: authReducer,
      album: albumReducer
    }),
    provideEffects([
      AuthEffects,
      AlbumEffects
    ]),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: JWT_OPTIONS, useValue: {} },
    JwtHelperService,
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
