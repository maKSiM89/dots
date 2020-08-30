import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DotsService {
  private dots: number[] = [];
  private delay: number;
  private activeIndex: number;
  private timer: number;
  private needToWinDots: number;
  private indexes: number[] = [];

  private dots$: BehaviorSubject<number[]> = new BehaviorSubject(this.dots);
  private isGameFinished$: Subject<string> = new Subject<string>();

  getDots(): Observable<number[]> {
    return this.dots$.asObservable();
  }

  get isGameFinished(): Observable<string> {
    return this.isGameFinished$.asObservable();
  }

  start(fields: number, delay: number): void {
    const length = fields * fields;

    this.stopTimer();

    this.dots = new Array(length).fill(0);
    this.delay = delay;
    this.needToWinDots = Math.floor(this.dots.length / 2);
    this.indexes = [...Array(length).keys()];

    this.dots$.next(this.dots);
    this.nextTick();
  }

  stop(shouldResetDots = true): void {
    this.stopTimer();

    this.delay = null;
    this.needToWinDots = null;

    if (shouldResetDots) {
      this.dots = [];
      this.indexes = [];
      this.dots$.next(this.dots);
    }
  }

  nextTick(): void {
    this.setRandomDotIndex();
    this.updateActiveDot(-1, false);

    this.timer = setTimeout(() => {
      this.updateActiveDot(2);
    }, this.delay);
  }

  updateActiveDot(value: number, check = true): void {
    this.dots[this.activeIndex] = value;
    this.dots$.next(this.dots);

    if (check) {
      this.checkIsGameFinished();
    }
  }

  stopTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  checkIsGameFinished(): void {
    const playerDots = this.dots.filter(dot => dot === 1).length;
    const computerDots = this.dots.filter(dot => dot === 2).length;

    if (playerDots > this.needToWinDots || computerDots > this.needToWinDots) {
      this.isGameFinished$.next(playerDots > computerDots ? 'player' : 'computer');
      this.stop(false);
    } else {
      this.nextTick();
    }
  }

  setRandomDotIndex(): void {
    const position = Math.round(Math.random() * (this.indexes.length - 1));

    this.activeIndex = this.indexes[position];
    this.indexes.splice(position, 1);
  }

  fillActiveDot(index: number): void {
    if (this.activeIndex === index) {
      this.stopTimer();
      this.updateActiveDot(1);
    }
  }
}
