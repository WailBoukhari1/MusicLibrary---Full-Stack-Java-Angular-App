import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../models/auth.model';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    private router: Router
  ) {
    this.loadStoredUser();
    // Check token validity periodically
    setInterval(() => {
      this.isAuthenticatedSubject.next(this.hasValidToken());
    }, 60000); // Check every minute
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
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.data.token);
          // Store user data based on the token response
          const userData = {
            username: response.data.username,
            roles: response.data.roles
          };
          localStorage.setItem('user', JSON.stringify(userData));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, { username, email, password });
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

  logout(): Observable<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
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
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    return this.http.get<UserResponse>(`${this.apiUrl}/me`);
  }

  validateToken(): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/auth/validate`);
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { token });
  }

  private startRefreshTokenTimer(authResponse: AuthResponse) {
    if (authResponse.data?.token) {
      const jwtToken = JSON.parse(atob(authResponse.data.token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000);
      
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken(authResponse.data.token).subscribe();
      }, timeout);
    }
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
} 