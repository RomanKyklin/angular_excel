import {Component, OnInit} from '@angular/core';
import {CellService} from './services/cell.service';

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
  ngOnInit(): void {
  }

  constructor(private cellService: CellService) {
  }

  trackByCellsFn(index: number, item: Cell) {
    return `${item.x}${item.y}`;
  }

  trackByFn(index: number, item) {
    return index;
  }
}
