import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cell} from '../../app.component';

export interface CellEvent {
  $event: any;
  cell: Cell;
  text: string;
}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  constructor() {
  }

  @Input() cell: Cell;
  @Output() focusEventEmitted: EventEmitter<CellEvent> = new EventEmitter<CellEvent>();
  @Output() focusOutEventEmitted: EventEmitter<CellEvent> = new EventEmitter<CellEvent>();

  ngOnInit() {
  }

  onFocus($event, text: string) {
    this.focusEventEmitted.emit({
      $event,
      cell: this.cell,
      text
    });
  }

  onFocusOut($event, text: string) {
    this.focusOutEventEmitted.emit({
      $event,
      cell: this.cell,
      text
    });
  }
}
