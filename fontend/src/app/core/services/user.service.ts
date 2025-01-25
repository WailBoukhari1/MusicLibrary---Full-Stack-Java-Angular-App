import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse, UsersResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 0, size: number = 10): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  updateUserRoles(userId: string, roles: string[]): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${userId}/roles`, roles);
  }

  deleteUser(userId: string): Observable<UserResponse> {
    return this.http.delete<UserResponse>(`${this.apiUrl}/${userId}`);
  }
} 