import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
  @ViewChild('inputElement', null) inputElement: ElementRef;
  isInputVisible = false;

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
    this.isInputVisible = false;
  }

  setFocus() {
    this.isInputVisible = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputElement.nativeElement.focus();
    }, 0);
  }
}
