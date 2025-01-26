import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<{ data: User }> {
    return this.http.get<{ data: User }>(`${this.apiUrl}/profile`);
  }

  updateProfile(user: Partial<User>): Observable<{ data: User }> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/profile`, user);
  }

  updateAvatar(formData: FormData): Observable<{ data: { avatarUrl: string } }> {
    return this.http.post<{ data: { avatarUrl: string } }>(`${this.apiUrl}/avatar`, formData);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  getUserPlaylists(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/playlists`);
  }

  getUserFavorites(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(`${this.apiUrl}/favorites`);
  }

  getUsers(page: number = 0, size: number = 10): Observable<{ content: User[]; totalElements: number }> {
    return this.http.get<{ content: User[]; totalElements: number }>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  updateUserRole(userId: string, role: string): Observable<{ data: User }> {
    return this.http.put<{ data: User }>(`${this.apiUrl}/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
} 