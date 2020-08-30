import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';

import { Leader} from '../../shared/interfaces';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaderBoardService {
  private url = `${environment.apiURL}/winners`;
  private leaders$: Subject<Leader[]> = new Subject<Leader[]>();

  constructor(private http: HttpClient) {}

  get leaders(): Observable<Leader[]> {
    return this.leaders$.asObservable();
  }

  fetchLeaders(): Subscription {
    return this.http.get<Leader[]>(this.url)
      .subscribe((leaders: Leader[]) => {
        this.leaders$.next(leaders);
      });
  }

  saveLeader(leaderName: string): Subscription {
    return this.http.post<Leader[]>(this.url, {
      winner: leaderName,
      date: formatDate(new Date(), 'HH:mm; dd MMMM yyyy', 'en-US')
    })
      .subscribe((leaders: Leader[]) => {
        this.leaders$.next(leaders);
      });
  }
}
