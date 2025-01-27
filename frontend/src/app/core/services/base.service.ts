import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export abstract class BaseService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? error.error.message
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  protected getFileUrl(fileId: string | undefined): string {
    return fileId ? `${this.baseUrl}/files/${fileId}` : '';
  }

  protected createQueryParams(params: Record<string, any>): HttpParams {
    return Object.entries(params).reduce(
      (httpParams, [key, value]) => httpParams.set(key, value.toString()),
      new HttpParams()
    );
  }
} 