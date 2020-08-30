import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GameBoardService} from './game-board.service';
import { GameSettings, Mode } from '../../shared/interfaces';
import { DotsService } from '../../shared/dots.service';
import { LeaderBoardService } from '../leader-board/leader-board.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  form: FormGroup;
  field = 0;
  delay: number;
  dots = [];
  message = '';
  playButtonText = 'Play';
  modes: Mode[] = [];
  settings: GameSettings;
  activeMode: string;

  private subject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private gameBoardService: GameBoardService,
    private dotsService: DotsService,
    private leaderBoardService: LeaderBoardService
  ) {}

  get mode(): AbstractControl {
    return this.form.get('mode');
  }

  get name(): AbstractControl {
    return this.form.get('name');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      mode: new FormControl('', [Validators.required])
    });

    this.gameBoardService.getSettings()
      .pipe(takeUntil(this.subject))
      .subscribe((settings: GameSettings) => {
        this.settings = settings;
        this.modes = Object.values(settings);
      });

    this.dotsService.getDots()
      .pipe(takeUntil(this.subject))
      .subscribe(dots => {
        this.dots = dots;
      });

    this.dotsService.isGameFinished
      .pipe(takeUntil(this.subject))
      .subscribe((winner: string) => {
        const winnerName = winner === 'player' ? this.name.value : 'Computer';

        this.message = `${winnerName} won`;
        this.playButtonText = 'Play again';
        this.leaderBoardService.saveLeader(winnerName);
      });
  }

  ngOnDestroy(): void {
    this.subject.next(true);
    this.subject.unsubscribe();
  }

  onSubmit(): void {
    this.message = '';

    this.dotsService.start(this.field, this.delay);
  }

  onChange(value: string): void {
    if (value) {
      this.field = this.settings[value].field || 5;
      this.delay = this.settings[value].delay || 1000;
      this.activeMode = this.settings[value].name.toLowerCase();

      this.dotsService.stop();
    }
  }

  onBoxClick(row: number, col: number): void {
    const index = row * this.field + col;

    this.dotsService.fillActiveDot(index);
  }
}
