import { createActionGroup, props } from '@ngrx/store';
import { Album } from '../../core/models/album.model';
import { Song } from '../../core/models/song.model';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Play Album': props<{ album: Album }>(),
    'Play Song': props<{ song: Song }>(),
    'Pause': emptyProps(),
    'Resume': emptyProps(),
    'Next Track': emptyProps(),
    'Previous Track': emptyProps(),
    'Set Queue': props<{ songs: Song[] }>(),
    'Set Current Track': props<{ song: Song | null }>(),
    'Set Playing State': props<{ isPlaying: boolean }>(),
  }
}); 