import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CategoryEnum, GenreEnum, EnumValue } from '../models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class EnumService {
  private apiUrl = `${environment.apiUrl}/enums`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getEnum<T extends EnumValue>(type: string): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<Record<string, string>>>(`${this.apiUrl}/${type}`, {
      headers: this.getHeaders()
    }).pipe(
      retry(3),
      map(response => ({
        success: true,
        data: Object.entries(response.data || {}).map(([name, displayName]) => ({
          name,
          displayName
        })) as T[]
      })),
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<ApiResponse<CategoryEnum[]>> {
    return this.getEnum<CategoryEnum>('categories');
  }

  getGenres(): Observable<ApiResponse<GenreEnum[]>> {
    return this.getEnum<GenreEnum>('genres');
  }
}
