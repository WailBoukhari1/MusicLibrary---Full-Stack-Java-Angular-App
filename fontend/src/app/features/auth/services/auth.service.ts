import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../../admin/users/models/user.model';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const user: User = {
        id: '0',
        username: decodedToken.sub,
        email: '',
        roles: decodedToken.roles || [],
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.currentUserSubject.next(user);
    }
  }

  login(username: string, password: string): Observable<ApiResponse<AuthResponse>> {
    const request: LoginRequest = { username, password };
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.storeTokens(response.data);
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
    const refreshToken = localStorage.getItem('refreshToken');
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
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes('ADMIN') || false;
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`);
  }

  validateToken(): Observable<ApiResponse<boolean>> {
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/validate`);
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
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

  public clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Store both tokens
  private storeTokens(authResponse: AuthResponse) {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }
} 