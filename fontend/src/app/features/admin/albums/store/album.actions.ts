import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Album } from '../models/album.model';

export const AlbumActions = createActionGroup({
  source: 'Album',
  events: {
    'Load Albums': props<{ page: number; size: number }>(),
    'Load Albums Success': props<{ 
      albums: Album[]; 
      totalElements: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    }>(),
    'Load Albums Failure': props<{ error: string }>(),

    'Create Album': props<{ album: FormData }>(),
    'Create Album Success': props<{ album: Album }>(),
    'Create Album Failure': props<{ error: string }>(),

    'Update Album': props<{ id: string; album: FormData }>(),
    'Update Album Success': props<{ album: Album }>(),
    'Update Album Failure': props<{ error: string }>(),

    'Delete Album': props<{ id: string }>(),
    'Delete Album Success': props<{ id: string }>(),
    'Delete Album Failure': props<{ error: string }>(),

    'Select Album': props<{ album: Album | null }>(),

    'Load Album': props<{ id: string }>(),
    'Load Album Success': props<{ album: Album }>(),
    'Load Album Failure': props<{ error: string }>(),

    'Set Error': props<{ error: string }>(),
    'Clear Error': emptyProps(),
  }
}); 