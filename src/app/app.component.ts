import {Component} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';


type PlayerTurn = 'user1' | 'user2';
type Marking = 'close' | 'panorama_fish_eye' | 'empty';
type TicTacToeResult = 'User 1 Wins' | 'User 2 Wins' | 'Match Tie' | 'CurrentlyPlaying';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'tic-tac-toe';
  rows = ['0', '1', '2', '3'];
  cols = ['0', '1', '2', '3'];

  grid: Marking[][] = [
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty'],
  ];

  user1Wins = false;
  user2Wins = false;
  tie = false;
  playerTurn: PlayerTurn = 'user1';
  result: TicTacToeResult = 'CurrentlyPlaying';
  gridSize: any;

  constructor() {
  }

  play(row: number, col: number): void {
    console.log('playing');
    if (this.playerTurn === 'user1') {
      this.grid[row][col] = 'close';
    } else if (this.playerTurn === 'user2') {
      this.grid[row][col] = 'panorama_fish_eye';
    }
    this.checkResults();
    this.changePlayTurn();
  }

  changePlayTurn(): void {
    if (this.user1Wins || this.user2Wins) {
      return;
    }
    if (this.playerTurn === 'user1') {
      this.playerTurn = 'user2';
    } else {
      this.playerTurn = 'user1';
    }
  }

  checkResults(): void {
    this.validateResults();
  }

  resetGrid(): void {
    this.user2Wins = false;
    this.user1Wins = false;
    this.tie = false;
    this.playerTurn = 'user1';
    this.grid = [
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty'],
    ];
  }

  /**
   * TODO - Change validation to Sliding window logic to commomodate nxn grid.
   */
  validateResults(): void {
    this.user1Wins = this.validatedHorizontal('close')
      || this.validateVerticals('close')
      || this.validateDiagonalLeftToRight('close')
      || this.validateDiagonalRightToLeft('close');
    console.log(`user1Wins: ${this.user1Wins}`);
    if (this.user1Wins) {
      return;
    }
    this.user2Wins = this.validatedHorizontal('panorama_fish_eye')
      || this.validateVerticals('panorama_fish_eye')
      || this.validateDiagonalLeftToRight('panorama_fish_eye')
      || this.validateDiagonalRightToLeft('panorama_fish_eye');
    if (this.user2Wins) {
      return;
    }
    console.log(`user2Wins: ${this.user2Wins}`);
    this.tie = this.validateTieSituation();
  }

  validateTieSituation(): boolean {
    const isEmptyCellPresent: boolean = this.grid.filter(row => row.filter(cell => cell === 'empty').length > 0).length > 0;
    if (!isEmptyCellPresent && !this.user1Wins && !this.user2Wins) {
      return true;
    }
    return false;
  }

  validatedHorizontal(val: Marking): boolean {
    for (const row of this.grid) {
      const hzRes = [];
      const count = 0;
      for (const rowVal of row) {
        if (rowVal === val) {
          const lastItem: any = hzRes.pop();
          if (!lastItem) {
            hzRes.push(rowVal);
          }
          if (lastItem === val) {
            hzRes.push(lastItem);
            hzRes.push(rowVal);
          } else {
            continue;
          }
          if (hzRes.length === 4) {
            return true;
          }
        }
      }
    }
    return false;
  }

  validateVerticals(val: Marking): boolean {
    const colSize = this.grid[0].length;
    for (let i = 0; i < colSize; i++) {
      const vtRes = [];
      for (const row of this.grid) {
        if (row[i] === val) {
          const lastItem: any = vtRes.pop();
          if (!lastItem) {
            vtRes.push(val);
          }
          if (lastItem === val) {
            vtRes.push(lastItem);
            vtRes.push(val);
          } else {
            continue;
          }
          if (vtRes.length === 4) {
            return true;
          }
        }
      }
    }
    return false;
  }

  validateDiagonalLeftToRight(val: Marking): boolean {
    const rowSize = this.grid.length;
    const dgRes: any = [];
    for (let i = 0; i < rowSize; i++) {
      const item = this.grid[i][i];
      if (item === val) {
        const lastItem = dgRes.pop();
        if (!lastItem) {
          dgRes.push(val);
          continue;
        }
        if (lastItem === val) {
          dgRes.push(lastItem);
          dgRes.push(val);
        } else {
          continue;
        }
      }
      if (dgRes.length === 4) {
        return true;
      }
    }
    return false;
  }

  validateDiagonalRightToLeft(val: Marking): boolean {
    const rowSize = this.grid.length;
    const dgRes: any = [];
    for (let i = rowSize - 1, j = 0; i >= 0; i--, j++) {
      const item = this.grid[j][i];
      if (item === val) {
        const lastItem = dgRes.pop();
        if (!lastItem) {
          dgRes.push(val);
          continue;
        }
        if (lastItem === val) {
          dgRes.push(lastItem);
          dgRes.push(val);
        } else {
          continue;
        }
      }
      if (dgRes.length === 4) {
        return true;
      }
    }
    return false;
  }

  changeGridSize(event: MatSliderChange): void {
    this.resetGrid();
    setTimeout(() => {
      console.log(event.value);
      const gridSize: number = event.value ? event.value : 4;
      const value: Marking = 'empty';
      this.grid = [...Array(this.gridSize)].map(e => Array(this.gridSize).fill(value));
    }, 150);
  }
}
