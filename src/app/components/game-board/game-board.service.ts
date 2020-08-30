import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GameSettings } from '../../shared/interfaces';
import { environment } from '../../../environments/environment';
import { levelNameMap } from './game-board.constant';


@Injectable({
  providedIn: 'root'
})
export class GameBoardService {
  private url = `${environment.apiURL}/game-settings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<GameSettings> {
    return this.http.get<GameSettings>(this.url)
      .pipe(map((settings: GameSettings) => {
        const extendedSettings: GameSettings = Object.assign({}, settings);

        Object.keys(settings).forEach((key: string) => {
          extendedSettings[key] = {
            ...extendedSettings[key],
            name: levelNameMap[key],
            id: key
          };
        });

        return extendedSettings;
      }));
  }
}
