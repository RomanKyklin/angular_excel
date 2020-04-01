import {Injectable} from '@angular/core';
import {CellEvent} from '../components/cell/cell.component';
import {Cell} from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class CellService {
  private readonly recursiveCellErrorText = 'Recursive cell!';
  private readonly TABLE_WIDTH = 100;
  private readonly TABLE_HEIGHT = 1000;
  public headerCells: string[] = [];
  public rows: number[] = [];
  public cells = [];
  public input: any = document.createElement('input');
  constructor() {
    this.headerCells = this.getHeaderCells(this.TABLE_WIDTH);
    this.rows = this.getRows(this.TABLE_HEIGHT);
    this.cells = this.getCells();
  }

  onFocus($event: CellEvent) {
    const {cell} = $event;
    cell.text = cell.formula;
  }

  onFocusOut($event: CellEvent) {
    const {cell, text} = $event;
    if (text) {
      cell.formula = text;
      cell.text = this.parseCellText(cell, text) as string;
    }
  }

  parseCellText(cell: Cell, text: string): number | string {
    if (this.isCellsOperation(text)) {
      return this.isCellRecursive(cell, text)
        ? this.recursiveCellErrorText : this.parsePlusSeparatedExpression(this.parseCells(text));
    } else if (this.isNumericOperation(text)) {
      return this.parsePlusSeparatedExpression(text);
    }
    return text;
  }

  private isCellRecursive(cell: Cell, text: string): boolean {
    return text.toLowerCase().search(`${cell.x}${cell.y}`.toLowerCase()) !== -1;
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

  private columnNames(n) {
    const result = [];

    const indexA = 'A'.charCodeAt(0);
    const indexZ = 'Z'.charCodeAt(0);

    let alphabetLength = indexZ - indexA + 1;
    const repeatNum = Math.floor(n / alphabetLength);

    let startIndex = 0;
    let startString = '';
    let str = '';

    while (startIndex <= repeatNum) {
      if (startIndex > 0) {
        startString = String.fromCharCode(indexA + startIndex - 1);
      }

      if (startIndex === repeatNum) {
        alphabetLength = n % alphabetLength;
      }

      for (let i = 0; i < alphabetLength; i++) {
        str = String.fromCharCode(indexA + i);

        result.push(startString + str);
      }
      startIndex++;
    }
    return result;
  }

  public getHeaderCells(width: number): string[] {
    return this.columnNames(width);
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
}
