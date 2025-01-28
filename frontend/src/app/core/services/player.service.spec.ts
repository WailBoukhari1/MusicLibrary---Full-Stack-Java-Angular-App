import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Song } from '../models/song.model';

describe('PlayerService', () => {
  let service: PlayerService;
  let store: jasmine.SpyObj<Store>;

  const mockSongs: Song[] = [
    { id: '1', title: 'Song 1', audioUrl: 'url1' },
    { id: '2', title: 'Song 2', audioUrl: 'url2' }
  ];

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: Store, useValue: storeSpy },
        provideMockStore()
      ]
    });

    service = TestBed.inject(PlayerService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set playlist', () => {
    service.setPlaylist(mockSongs);
    expect(service.getCurrentSong()).toEqual(mockSongs[0]);
  });

  it('should get next song', () => {
    service.setPlaylist(mockSongs);
    expect(service.getNextSong()).toEqual(mockSongs[1]);
  });

  it('should get previous song', () => {
    service.setPlaylist(mockSongs);
    service.getNextSong(); // Move to second song
    expect(service.getPreviousSong()).toEqual(mockSongs[0]);
  });

  it('should set volume', () => {
    spyOn(HTMLAudioElement.prototype, 'volume', 'set');
    service.setVolume(0.5);
    expect(HTMLAudioElement.prototype.volume).toBe(0.5);
  });

  it('should seek to position', () => {
    spyOn(HTMLAudioElement.prototype, 'duration', 'get').and.returnValue(100);
    spyOn(HTMLAudioElement.prototype, 'currentTime', 'set');
    service.seek(50);
    expect(HTMLAudioElement.prototype.currentTime).toBe(50);
  });
}); 