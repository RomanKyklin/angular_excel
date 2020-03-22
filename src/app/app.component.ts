import {Component, OnInit} from '@angular/core';

export interface Cell {
  x: string;
  y: number;
  text: string;
  formula?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly TABLE_WIDTH = 26;
  public readonly TABLE_HEIGHT = 26;
  public headerCells: string[] = [];
  public rows: number[] = [];
  public cells = [];

  ngOnInit(): void {
    this.headerCells = this.getHeaderCells(this.TABLE_WIDTH);
    this.rows = this.getRows(this.TABLE_HEIGHT);
    this.cells = this.getCells();
  }

  constructor() {
  }

  public getHeaderCells(width: number): string[] {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const result: string[] = [];
    for (let i = 0; i < width; i++) {
      result.push(alphabet[i]);
    }
    return result;
  }

  public getRows(height: number) {
    const result: number[] = [];
    for (let i = 0; i < height; i++) {
      result.push(i);
    }
    return result;
  }

  public getCells() {
    const result = [];
    this.rows.forEach((row, i) => {
      let cellsArray = [];
      this.headerCells.forEach((header, j) => {
        cellsArray.push({x: this.headerCells[j], y: i, text: ''} as Cell);
      });
      result.push(cellsArray);
      cellsArray = [];
    });
    return result;
  }

  onKeyUp($event, cell: Cell, text: string) {
    if (this.isEnterTouched($event)) {
      cell.formula = text;
      cell.text = this.parseCellText(text) as string;
    }
  }

  onFocus($event, cell: Cell, text: string) {
    cell.text = cell.formula;
  }

  onFocusOut($event, cell: Cell, text: string) {
    cell.formula = text;
    cell.text = this.parseCellText(text) as string;
  }

  private isEnterTouched($event: KeyboardEvent) {
    return $event.key === 'Enter' && $event.code === 'Enter';
  }

  private parseCellText(text: string): number | string {
    if (this.isCellsOperation(text)) {
      return this.parsePlusSeparatedExpression(this.parseCells(text));
    } else if (this.isNumericOperation(text)) {
      return this.parsePlusSeparatedExpression(text);
    }
    return text;
  }

  private parseCells(text: string): string {
    let result = text;
    const cellsKeys = text.match(/[(a-zA-Z)(0-9)]+/gm);
    cellsKeys.forEach(cellKey => {
      this.cells.forEach((cellArr: Cell[]) => {
        const foundCell = cellArr.find(val => {
          const actualCellKey = `${val.x}${val.y}`;
          return cellKey.toLowerCase() === actualCellKey.toLowerCase();
        });
        if (foundCell) {
          result = result.replace(cellKey, foundCell.text);
        }
      });
    });
    return result;
  }

  private parsePlusSeparatedExpression(expression): number {
    const numbersString = this.split(expression, '+');
    const numbers = numbersString.map(noStr => this.parseMinusSeparatedExpression(noStr));
    const initialValue = 0.0;
    return numbers.reduce((acc, no) => acc + no, initialValue);
  }

  private parseMultiplicationSeparatedExpression(expression): number {
    const numbersString = expression.split('*');
    const numbers = numbersString.map(noStr => this.parseDivisionSeparatedExpression(noStr));
    const initialValue = 1.0;
    return numbers.reduce((acc, no) => acc * no, initialValue);
  }

  private parseMinusSeparatedExpression(expression): number {
    const numbersString = expression.split('-');
    const numbers = numbersString.map(noStr => this.parseMultiplicationSeparatedExpression(noStr));
    const initialValue = numbers[0];
    return numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
  }

  private parseDivisionSeparatedExpression(expression): number {
    const numbersString = expression.split('/');
    const numbers = numbersString.map(noStr => {
      if (noStr[0] === '(') {
        const expr = noStr.substr(1, noStr.length - 2);
        return this.parsePlusSeparatedExpression(expr);
      }
      return +noStr;
    });
    const initialValue = numbers[0];
    return numbers.slice(1).reduce((acc, no) => acc / no, initialValue);
  }

  private split(expression: string, operator: string) {
    const result = [];
    let braces = 0;
    let currentChunk = '';
    for (let i = 0; i < expression.length; ++i) {
      const curCh = expression[i];
      if (curCh === '(') {
        braces++;
      } else if (curCh === ')') {
        braces--;
      }
      if (braces === 0 && operator === curCh) {
        result.push(currentChunk);
        currentChunk = '';
      } else {
        currentChunk += curCh;
      }
    }
    if (currentChunk !== '') {
      result.push(currentChunk);
    }
    return result;
  }

  private isNumericOperation(text: string): boolean {
    return text[0] === '(' || this.isNumeric(text[0]);
  }

  private isCellsOperation(text: string): boolean {
    return text.search(/[(a-zA-Z)(0-9)]+/gm) !== -1;
  }

  private isNumeric = (num: any) => (typeof (num) === 'number' || typeof (num) === 'string' && num.trim() !== '') && !isNaN(num as number);
}
