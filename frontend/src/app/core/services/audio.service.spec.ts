import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AudioService } from './audio.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Song } from '../models/song.model';

describe('AudioService', () => {
  let service: AudioService;
  let store: jasmine.SpyObj<Store>;

  const mockSong: Song = {
    id: '1',
    title: 'Test Song',
    audioFileId: 'audio-123',
    duration: 180,
    artist: 'Artist 1'
  };

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AudioService,
        { provide: Store, useValue: storeSpy },
        provideMockStore()
      ]
    });

    service = TestBed.inject(AudioService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should play song', () => {
    spyOn(HTMLAudioElement.prototype, 'play').and.returnValue(Promise.resolve());
    service.play(mockSong);
    expect(service.getCurrentSong()).toEqual(mockSong);
  });

  it('should pause song', () => {
    spyOn(HTMLAudioElement.prototype, 'pause');
    service.pause();
    expect(service.isPaused()).toBeTrue();
  });

  it('should set volume', () => {
    const volume = 0.5;
    service.setVolume(volume);
    expect(service.isPaused()).toBeTrue(); // Audio should be paused initially
  });

  it('should seek to specific time', () => {
    const time = 30;
    service.seek(time);
    // Add expectations based on your implementation
  });
}); 