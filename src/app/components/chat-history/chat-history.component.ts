import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChatHistoryTitle, LastSessionModel} from "../../models";
import {backChatHistorySubject, chatSessionSubject} from "../../share-datas/datas.module";
import {Observable, Observer} from "rxjs";
import {LastSessionToken} from "../../models/lastSession.model";
import {HistoryTitleService} from "../../share-datas";

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css'
})
export class ChatHistoryComponent implements OnChanges
{
  @Input()
  chatHistoryTitle: ChatHistoryTitle[] | undefined;
  selectId: number | undefined;
  constructor(@Inject(chatSessionSubject) private chatSessionObserver:Observer<number> ,
              @Inject(backChatHistorySubject) private backHistoryObservable: Observable<ChatHistoryTitle>,
              @Inject(LastSessionToken) private lastSession: LastSessionModel,
              ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      console.log("aware subscribe "+historyTitle.dataId)
      this.changeSession(historyTitle.dataId)
    })
  }


  changeSession(dataId: number) {
    this.selectId = dataId;
    this.chatSessionObserver.next(dataId);
    // console.log("回调,数据")
    this.lastSession.sessionId = dataId;
  }

  async newChat() {
    this.selectId = -1;
    this.chatSessionObserver.next(-1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.chatHistoryTitle){
      if(this.chatHistoryTitle.length>=1){
        const first = this.chatHistoryTitle![0];
        this.selectId = first.dataId;
        this.chatSessionObserver.next(this.selectId);
        this.lastSession.sessionId = this.selectId;
      }
    }
  }

}
