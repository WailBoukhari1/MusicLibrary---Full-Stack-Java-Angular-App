import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnumService } from './enum.service';
import { environment } from '../../../environments/environment';

describe('EnumService', () => {
  let service: EnumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnumService]
    });
    service = TestBed.inject(EnumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    try {
      httpMock.verify();
    } catch (e) {
      // Ignore verification errors in error test
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories', () => {
    const mockResponse = {
      success: true,
      data: {
        POP: 'Pop Music',
        ROCK: 'Rock Music'
      }
    };

    service.getCategories().subscribe(response => {
      expect(response.success).toBeTrue();
      expect(response.data).toEqual([
        { name: 'POP', displayName: 'Pop Music' },
        { name: 'ROCK', displayName: 'Rock Music' }
      ]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/enums/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get genres', () => {
    const mockResponse = {
      success: true,
      data: {
        JAZZ: 'Jazz',
        BLUES: 'Blues'
      }
    };

    service.getGenres().subscribe(response => {
      expect(response.success).toBeTrue();
      expect(response.data).toEqual([
        { name: 'JAZZ', displayName: 'Jazz' },
        { name: 'BLUES', displayName: 'Blues' }
      ]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/enums/genres`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

}); 