import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SongService } from '../../../../core/services/song.service';
import { SongResponse } from '../../../../core/models/song.model';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Songs</h1>
        <button mat-raised-button color="primary" routerLink="new">
          Add New Song
        </button>
      </div>

      <table mat-table [dataSource]="songs" class="w-full">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let song">{{song.title}}</td>
        </ng-container>

        <ng-container matColumnDef="artist">
          <th mat-header-cell *matHeaderCellDef>Artist</th>
          <td mat-cell *matCellDef="let song">{{song.artist}}</td>
        </ng-container>

        <ng-container matColumnDef="trackNumber">
          <th mat-header-cell *matHeaderCellDef>Track #</th>
          <td mat-cell *matCellDef="let song">{{song.trackNumber}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let song">
            <button mat-icon-button [routerLink]="['edit', song.id]">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteSong(song.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 25, 100]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `
})
export class SongListComponent implements OnInit {
  songs: SongResponse[] = [];
  displayedColumns = ['title', 'artist', 'trackNumber', 'actions'];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getAllSongs(this.currentPage, this.pageSize)
      .subscribe(response => {
        if (response.success && response.data) {
          this.songs = response.data.content;
          this.totalElements = response.data.totalElements;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSongs();
  }

  deleteSong(id: string): void {
    if (confirm('Are you sure you want to delete this song?')) {
      this.songService.deleteSong(id).subscribe(() => {
        this.loadSongs();
      });
    }
  }
} 