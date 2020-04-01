import {Component, ChangeDetectionStrategy, ElementRef,ChangeDetectorRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {Cell} from '../../app.component';
import {CellService} from '../../services/cell.service';

export interface CellEvent {
  $event: any;
  cell: Cell;
  text: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements AfterViewInit {
  @Input() cell: Cell;
  @ViewChild('container', { static: true }) container: ElementRef;
  constructor(private cellService: CellService, private cd:ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.cd.detach()
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
    // const cellEvent: CellEvent = {
    //   $event,
    //   cell: this.cell,
    //   text,
    // };
    // this.cellService.onFocusOut(cellEvent);
    // this.isInputVisible = false;
  }

  setFocus() {
    this.cellService.input.remove();
    this.container.nativeElement.appendChild(this.cellService.input);
    this.cellService.input.focus();
  }
}
