import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlbumService } from './album.service';
import { environment } from '../../../environments/environment';
import { Album } from '../models/album.model';
import { ApiResponse } from '../models/api-response.model';
import { Page } from '../models/page.model';

describe('AlbumService', () => {
  let service: AlbumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlbumService]
    });
    service = TestBed.inject(AlbumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get albums with pagination', () => {
    const mockResponse = {
      success: true,
      data: {
        content: [
          { id: '1', title: 'Album 1' },
          { id: '2', title: 'Album 2' }
        ],
        totalElements: 2,
        totalPages: 1,
        size: 10,
        number: 0
      }
    };

    service.getAlbums(0, 10).subscribe(response => {
      expect(response).toEqual(mockResponse as ApiResponse<Page<Album>>);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/albums?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create album', () => {
    const mockAlbum = { id: '1', title: 'New Album' };
    const mockResponse = { success: true, data: mockAlbum };
    const formData = new FormData();

    service.createAlbum(formData).subscribe(response => {
      expect(response).toEqual(mockResponse as ApiResponse<Album>);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/albums`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete album', () => {
    const albumId = '1';
    const mockResponse = { success: true, data: undefined };

    service.deleteAlbum(albumId).subscribe(response => {
      expect(response).toEqual(mockResponse as ApiResponse<void>);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/albums/${albumId}?deleteSongs=true`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
}); 