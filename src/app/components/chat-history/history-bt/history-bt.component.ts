import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  show: boolean = false;
  changeSession(dataId: number | undefined,$event: MouseEvent) {
    if(!dataId) return;
    if($event.target===$event.currentTarget){
      this.historyChangeEvent.emit(dataId);
    }else{
      console.log("span clicked")
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
