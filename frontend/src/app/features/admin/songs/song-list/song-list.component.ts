import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Song } from '../../../../core/models/song.model';
import * as SongActions from '../../../../store/song/song.actions';
import { selectAllSongs, selectSongsLoading, selectSongsError, selectSongsTotalElements } from '../../../../store/song/song.selectors';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PlayerActions } from '../../../../store/player/player.actions';
import { environment } from '../../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl:"song-list.component.html"
})
export class SongListComponent implements OnInit {
  songs$: Observable<Song[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalElements$: Observable<number>;
  displayedColumns = ['cover', 'title', 'artist', 'album', 'duration', 'actions'];

  constructor(
    private router: Router,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.songs$ = this.store.select(selectAllSongs);
    this.loading$ = this.store.select(selectSongsLoading);
    this.error$ = this.store.select(selectSongsError);
    this.totalElements$ = this.store.select(selectSongsTotalElements);
  }

  ngOnInit(): void {
    this.store.dispatch(SongActions.loadSongs({ page: 0, size: 10 }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(SongActions.loadSongs({ page: event.pageIndex, size: event.pageSize }));
  }

  playSong(song: Song): void {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onCreateSong() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(songId: string): void {
    this.router.navigate(['/admin/songs/edit', songId]);
  }

  getImageUrl(coverUrl: string | null | undefined): string {
    if (!coverUrl) return 'assets/default-songs.png';
    return `${environment.apiUrl}/files/${coverUrl}`;
  }

  onDeleteSong(song: Song): void {
    if (confirm('Are you sure you want to delete this song?')) {
      if (song && song.id) {
        this.store.dispatch(SongActions.deleteSong({ id: song.id }));
      }
    }
  }
} 