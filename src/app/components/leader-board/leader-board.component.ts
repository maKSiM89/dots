import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription} from 'rxjs';

import { LeaderBoardService } from './leader-board.service';
import { Leader } from '../../shared/interfaces';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Leader>([]);
  displayedColumns: string[] = [
    'winner',
    'date'
  ];

  private sub: Subscription;

  constructor(private leaderBoardService: LeaderBoardService) { }

  ngOnInit(): void {
    this.leaderBoardService.fetchLeaders();

    this.sub = this.leaderBoardService.leaders
      .subscribe((leaders: Leader[]) => {
        this.dataSource.data = leaders.reverse();
        this.dataSource.paginator = this.paginator;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  trackByFn(index: number, item: Leader): number {
    return item.id;
  }
}
