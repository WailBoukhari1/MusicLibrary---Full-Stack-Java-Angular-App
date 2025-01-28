import { TestBed } from '@angular/core/testing';
import { PlayerService } from './player.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Song } from '../models/song.model';

describe('PlayerService', () => {
  let service: PlayerService;
  let store: jasmine.SpyObj<Store>;
  let audioElement: jasmine.SpyObj<HTMLAudioElement>;

  const mockSongs: Song[] = [
    { id: '1', title: 'Song 1', audioUrl: 'url1', artist: 'Artist 1' },
    { id: '2', title: 'Song 2', audioUrl: 'url2', artist: 'Artist 2' }
  ];

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    
    let volumeValue = 0;
    let currentTimeValue = 0;

    audioElement = jasmine.createSpyObj('HTMLAudioElement', 
      ['play', 'pause', 'addEventListener', 'removeEventListener'], {
      get volume() { return volumeValue; },
      set volume(v) { volumeValue = v; },
      get currentTime() { return currentTimeValue; },
      set currentTime(t) { currentTimeValue = t; },
      get duration() { return 100; }
    });
    spyOn(window, 'Audio').and.returnValue(audioElement);

    TestBed.configureTestingModule({
      providers: [
        PlayerService,
        { provide: Store, useValue: storeSpy },
        provideMockStore({})
      ]
    });

    service = TestBed.inject(PlayerService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
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

}); 