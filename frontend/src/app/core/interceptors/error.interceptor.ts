import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = error.error.message;
      } else {
        // Server-side errors
        errorMessage = handleServerError(error);
      }

      // Show error message using SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        confirmButtonColor: '#3085d6',
        timer: error.status === 401 ? 2000 : undefined // Auto close for unauthorized errors
      });

      return throwError(() => error);
    })
  );
};

function handleServerError(error: HttpErrorResponse): string {
  switch (error.status) {
    case 400:
      return handleBadRequestError(error);
    case 401:
      return handleUnauthorizedError(error);
    case 403:
      return handleForbiddenError(error);
    case 404:
      return handleNotFoundError(error);
    case 405:
      return 'Method not allowed. Please contact support.';
    case 408:
      return 'Request timeout. Please try again.';
    case 409:
      return handleConflictError(error);
    case 422:
      return handleValidationError(error);
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 501:
      return 'Service not implemented. Please contact support.';
    case 502:
      return 'Bad gateway. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    case 504:
      return 'Gateway timeout. Please try again later.';
    case 0:
      return 'Unable to connect to the server. Please check your internet connection.';
    default:
      return 'Something unexpected happened. Please try again.';
  }
}

function handleBadRequestError(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }
  if (error.error?.errors) {
    // Handle validation errors
    const validationErrors = error.error.errors;
    if (Array.isArray(validationErrors)) {
      return validationErrors.join('\n');
    }
    return Object.values(validationErrors).join('\n');
  }
  return 'Invalid request. Please check your input.';
}

function handleUnauthorizedError(error: HttpErrorResponse): string {
  if (error.error?.message?.toLowerCase().includes('expired')) {
    return 'Your session has expired. Please login again.';
  }
  if (error.error?.message?.toLowerCase().includes('invalid')) {
    return 'Invalid credentials. Please check your username and password.';
  }
  return 'Unauthorized access. Please login again.';
}

function handleForbiddenError(error: HttpErrorResponse): string {
  if (error.error?.message?.toLowerCase().includes('role')) {
    return 'You don\'t have the required role to access this resource.';
  }
  if (error.error?.message?.toLowerCase().includes('permission')) {
    return 'You don\'t have permission to perform this action.';
  }
  return 'Access forbidden. You don\'t have permission to access this resource.';
}

function handleNotFoundError(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }
  const resource = getResourceFromUrl(error.url || '');
  return `The requested ${resource} was not found.`;
}

function handleConflictError(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }
  return 'A conflict occurred. The resource might already exist.';
}

function handleValidationError(error: HttpErrorResponse): string {
  if (error.error?.message) {
    return error.error.message;
  }
  if (error.error?.errors) {
    const validationErrors = error.error.errors;
    if (Array.isArray(validationErrors)) {
      return validationErrors.join('\n');
    }
    return Object.values(validationErrors).join('\n');
  }
  return 'Validation failed. Please check your input.';
}

function getResourceFromUrl(url: string): string {
  const parts = url.split('/');
  const resource = parts[parts.length - 1] || parts[parts.length - 2];
  return resource.replace(/[-_]/g, ' ').toLowerCase();
} 