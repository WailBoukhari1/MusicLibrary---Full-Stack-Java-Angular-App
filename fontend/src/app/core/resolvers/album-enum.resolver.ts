import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumService } from '../services/enum.service';
import { CategoryEnum, GenreEnum } from '../models/enums.model';
import { ApiResponse } from '../models/api-response.model';

export interface AlbumEnums {
  categories: CategoryEnum[];
  genres: GenreEnum[];
}

@Injectable({
  providedIn: 'root'
})
export class AlbumEnumResolver implements Resolve<AlbumEnums> {
  constructor(private enumService: EnumService) {}

  resolve(): Observable<AlbumEnums> {
    return forkJoin({
      categories: this.enumService.getCategories().pipe(
        map(res => {
          if (!res.data) throw new Error('No categories data received');
          return res.data;
        })
      ),
      genres: this.enumService.getGenres().pipe(
        map(res => {
          if (!res.data) throw new Error('No genres data received');
          return res.data;
        })
      )
    });
  }
} 