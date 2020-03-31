import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Cell} from '../../app.component';
import {CellService} from '../../services/cell.service';

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
  constructor(private cellService: CellService) {
  }

  @Input() cell: Cell;
  @ViewChild('inputElement', null) inputElement: ElementRef;
  isInputVisible = false;

  ngOnInit() {
  }

  onFocus($event, text: string) {
    const cellEvent: CellEvent = {
      $event,
      cell: this.cell,
      text,
    };
    this.cellService.onFocus(cellEvent);
  }

  onFocusOut($event, text: string) {
    const cellEvent: CellEvent = {
      $event,
      cell: this.cell,
      text,
    };
    this.cellService.onFocusOut(cellEvent);
    this.isInputVisible = false;
  }

  setFocus() {
    this.isInputVisible = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputElement.nativeElement.focus();
    }, 0);
  }
}
