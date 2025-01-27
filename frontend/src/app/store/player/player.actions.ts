import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { Song } from '../../core/models/song.model';

export const PlayerActions = createActionGroup({
  source: 'Player',
  events: {
    'Play': props<{ song: Song }>(),
    'Pause': emptyProps(),
    'Resume': emptyProps(),
    'Stop': emptyProps(),
    'Set Volume': props<{ volume: number }>(),
    'Set Progress': props<{ progress: number }>(),
    'Next Song': emptyProps(),
    'Previous Song': emptyProps(),
    'Toggle Play': emptyProps(),
    'Set Playing': props<{ isPlaying: boolean }>(),
    'Play Album': props<{ songs: Song[] }>(),
    'Skip Next': emptyProps(),
    'Skip Previous': emptyProps(),
    'Seek': props<{ time: number }>(),
  }
});

export const nextSong = createAction('[Player] Next Song');
export const previousSong = createAction('[Player] Previous Song'); 