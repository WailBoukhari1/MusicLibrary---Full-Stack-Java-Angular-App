import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTokenTimeout?: any;
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store
  ) {
    // Initialize auth state
    this.store.dispatch(AuthActions.init());
    this.loadStoredUser();
    // Check token validity periodically
    setInterval(() => {
      this.isAuthenticatedSubject.next(this.hasValidToken());
    }, 60000); // Check every minute

    // Check for existing token on service initialization
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.getCurrentUser().subscribe();
    }
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      const decodedToken = this.jwtHelper.decodeToken(token);
      const user: User = {
        id: decodedToken.sub || '0',
        username: decodedToken.sub,
        email: decodedToken.email || '',
        roles: decodedToken.roles || [],
        active: decodedToken.active || true,
        createdAt: new Date(),
      };
      this.currentUserSubject.next(user);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (!response.success || !response.data) {
            throw new Error(response.error || 'Login failed');
          }
          // Store token
          localStorage.setItem('token', response.data.token);
          
          // Update current user
          const user: User = {
            username: response.data.username,
            roles: response.data.roles,
            id: response.data.username,
            email: '',
            active: true,
            createdAt: new Date()
          };
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<UserResponse> {
    const registerData: RegisterRequest = {
      username,
      email,
      password
    };

    return this.http.post<UserResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.data) {
      const user: User = {
        id: response.data.username,
        username: response.data.username,
        email: '',
        roles: response.data.roles,
        active: true,
        createdAt: new Date(),
      };
      this.currentUserSubject.next(user);
      this.redirectBasedOnRole(user.roles.includes('ADMIN'));
    }
  }

  private redirectBasedOnRole(isAdmin: boolean): void {
    const route = isAdmin ? '/admin/dashboard' : '/user/library';
    this.router.navigate([route]);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.isAuthenticatedSubject.next(true);
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  hasValidToken(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    return token ? this.jwtHelper.getTokenExpirationDate(token) : null;
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Decoded token:', decodedToken); // Debug full token
      console.log('Decoded token roles:', decodedToken?.roles);
      return decodedToken?.roles || [];  // Use roles directly without modification
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    console.log('Current user roles:', roles);
    return roles.includes('ADMIN');
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`)
      .pipe(
        tap(response => {
          if (!response.success || !response.data) {
            throw new Error('Failed to get user data');
          }
          this.currentUserSubject.next(response.data);
        }),
        catchError(error => {
          console.error('Get current user error:', error);
          this.logout(); // Clear invalid session
          return throwError(() => error);
        })
      );
  }

  validateToken(): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/auth/validate`);
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { token })
      .pipe(
        tap(response => {
          if (!response.success || !response.data) {
            throw new Error('Token refresh failed');
          }
          localStorage.setItem('token', response.data.token);
        }),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout(); // Clear invalid session
          return throwError(() => error);
        })
      );
  }

  private startRefreshTokenTimer(authResponse: AuthResponse) {
    // Check if authResponse and data exist and have a token
    if (authResponse?.data?.token) {
      try {
        const jwtToken = JSON.parse(atob(authResponse.data.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
        
        // Clear any existing timer
        this.stopRefreshTokenTimer();
        
        // Only set timer if timeout is positive
        if (timeout > 0) {
          this.refreshTokenTimeout = setTimeout(() => {
            this.refreshToken(authResponse.data!.token).subscribe({
              error: (error) => {
                console.error('Failed to refresh token:', error);
                this.logout(); // Logout on refresh failure
              }
            });
          }, timeout);
        } else {
          // Token is already expired or about to expire
          this.logout();
        }
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        this.logout();
      }
    } else {
      console.warn('No valid token found in auth response');
      this.logout();
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
} 