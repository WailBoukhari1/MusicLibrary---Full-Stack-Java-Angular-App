import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'apiDate',
  standalone: true
})
export class ApiDatePipe implements PipeTransform {
  // For form display (from API to form)
  toFormDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // Format to YYYY-MM-DD for form input
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // For API submission (from form to API)
  toApiDate(date: string | Date | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    // Format to match backend format: YYYY-MM-DDT00:00:00
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }

  // Default transform (for template usage)
  transform(date: string | Date | null | undefined, direction: 'toForm' | 'toApi' = 'toForm'): string {
    return direction === 'toForm' ? this.toFormDate(date) : this.toApiDate(date);
  }
} 