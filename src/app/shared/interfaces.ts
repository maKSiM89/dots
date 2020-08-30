export interface Leader {
  id: number;
  winner: string;
  date: Date;
}

export interface Mode {
  field: number;
  delay: number;
  name?: string;
  id?: string;
}

export interface GameSettings {
  easyMode: Mode;
  normalMode: Mode;
  hardMode: Mode;
}

export interface LevelNameMap {
  easyMode: string;
  normalMode: string;
  hardMode: string;
}
