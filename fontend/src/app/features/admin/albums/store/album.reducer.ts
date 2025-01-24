import { createReducer, on } from '@ngrx/store';
import { AlbumActions } from './album.actions';
import { initialAlbumState } from './album.state';

export const albumReducer = createReducer(
  initialAlbumState,
  
  on(AlbumActions.loadAlbums, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AlbumActions.loadAlbumsSuccess, (state, { albums, totalElements, totalPages, currentPage, pageSize }) => ({
    ...state,
    albums,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    loading: false
  })),
  
  on(AlbumActions.loadAlbumsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(AlbumActions.createAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: album ? [...state.albums, album] : state.albums,
    loading: false
  })),

  on(AlbumActions.updateAlbumSuccess, (state, { album }) => ({
    ...state,
    albums: album 
      ? state.albums.map(a => a.id === album.id ? album : a)
      : state.albums,
    loading: false
  })),

  on(AlbumActions.deleteAlbumSuccess, (state, { id }) => ({
    ...state,
    albums: state.albums.filter(a => a.id !== id),
    loading: false
  })),

  on(AlbumActions.selectAlbum, (state, { album }) => ({
    ...state,
    selectedAlbum: album
  }))
); 