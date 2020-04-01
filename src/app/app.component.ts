import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {CellService} from './services/cell.service';

export interface Cell {
  x: string;
  y: number;
  text: string;
  formula?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor(private cd: ChangeDetectorRef, private cellService: CellService) {
  }

  ngAfterViewInit(): void {
    this.cd.detach();
  }

  trackByCellsFn(index: number, item: Cell) {
    return `${item.x}${item.y}`;
  }

  trackByFn(index: number, item) {
    return index;
  }
}
