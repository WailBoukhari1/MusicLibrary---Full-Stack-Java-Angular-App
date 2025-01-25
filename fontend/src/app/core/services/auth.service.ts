import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
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
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.currentUserSubject.next(user);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  login(username: string, password: string): Observable<ApiResponse<AuthResponse>> {
    const request: LoginRequest = { username, password };
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setTokens(response.data.token, response.data.refreshToken);
            this.handleAuthResponse(response.data);
          }
        })
      );
  }

  register(username: string, email: string, password: string): Observable<ApiResponse<User>> {
    const request: RegisterRequest = { username, email, password };
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, request);
  }

  private handleAuthResponse(response: AuthResponse): void {
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      roles: response.roles,
      active: response.active,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt
    };
    this.currentUserSubject.next(user);
    this.redirectBasedOnRole(response.roles.includes('ADMIN'));
  }

  private redirectBasedOnRole(isAdmin: boolean): void {
    const route = isAdmin ? '/admin/dashboard' : '/user/library';
    this.router.navigate([route]);
  }

  logout(): Observable<ApiResponse<void>> {
    const refreshToken = this.getRefreshToken();
    const token = this.getToken();
    
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, { refreshToken }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        this.clearTokens();
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
      })
    );
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

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`);
  }

  validateToken(): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/validate`);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.startRefreshTokenTimer(response.data);
          }
        })
      );
  }

  private startRefreshTokenTimer(authResponse: AuthResponse) {
    // Parse the JWT token to get expiration
    const jwtToken = JSON.parse(atob(authResponse.token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
} 