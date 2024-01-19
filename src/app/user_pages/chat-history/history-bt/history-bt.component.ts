import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {
  ChatHistoryTitle,
} from "../../../user_anything/models";
import {
  ChatHistoryTitleAction,
  ChatHistoryTitleActionInfo,
  ChatHistoryTitleDeleteInfo
} from "../../../user_anything/models/operations";

@Component({
  selector: 'app-history-bt',
  templateUrl: './history-bt.component.html',
  styleUrl: './history-bt.component.css',
  imports: [
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    TranslateModule,
  ],
  standalone: true
})
export class HistoryBtComponent {
  @Input()
  selectId: number | undefined;
  @Input()
  history: ChatHistoryTitle | undefined;
  @Output()
  historyChangeEvent = new EventEmitter<number>();
  @Output()
  chatHistoryAction = new EventEmitter<ChatHistoryTitleActionInfo>();
  @ViewChild("spanBt")
  spanBt: ElementRef | undefined;
  show: boolean = false;
  changeSession(dataId: number | undefined,$event: MouseEvent) {
    if(!dataId) return;
    if(this.spanBt ===undefined || !this.spanBt.nativeElement.contains($event.target)){
      this.historyChangeEvent.emit(dataId);
    }else{
    }
  }

  showListActions() {
    this.show = true;
  }

  deleteAction() {
    this.chatHistoryAction.emit({
      action: ChatHistoryTitleAction.Delete,
      info: {
        dataId: this.history?.dataId
      } as ChatHistoryTitleDeleteInfo
    })
  }
}
