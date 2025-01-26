import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Album } from '../../core/models/album.model';
import { Song } from '../../core/models/song.model';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Play': props<{ song: Song }>(),
    'Play Album': props<{ album: Album }>(),
    'Toggle Play': emptyProps(),
    'Pause': emptyProps(),
    'Resume': emptyProps(),
    'Stop': emptyProps(),
    'Set Volume': props<{ volume: number }>(),
    'Set Progress': props<{ progress: number }>(),
    'Add To Queue': props<{ song: Song }>(),
    'Remove From Queue': props<{ songId: string }>(),
    'Clear Queue': emptyProps(),
    'Skip Next': emptyProps(),
    'Skip Previous': emptyProps(),
    'Toggle Shuffle': emptyProps(),
    'Toggle Repeat': emptyProps(),
    'Set Queue': props<{ songs: Song[] }>(),
    'Set Playing': props<{ isPlaying: boolean }>(),
  }
}); 