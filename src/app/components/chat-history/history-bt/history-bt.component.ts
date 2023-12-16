import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ChatHistoryTitleActionInfo, ChatHistoryTitleAction, ChatHistoryTitle, ChatHistoryTitleDeleteInfo} from "../../../models";

@Component({
  selector: 'app-history-bt',
  templateUrl: './history-bt.component.html',
  styleUrl: './history-bt.component.css'
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
      // console.log("触发的元素不属于span")
      this.historyChangeEvent.emit(dataId);
    }else{
      // console.log("span clicked")
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
