import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {ChatHistoryTitleActionInfo, ChatHistoryTitle, LastSessionModel} from "../../models";
import {Observable, Observer} from "rxjs";
import {SizeReportService} from "../../services";
import {SidebarService} from "../../services";
import {MagicDataId} from "../chat-page/chat-page.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {HistoryBtComponent} from "./history-bt/history-bt.component";
import {NgForOf} from "@angular/common";
import {backChatHistorySubject, chatSessionSubject} from "../../tokens/subject.data";
import {lastSessionToken, sideBarToken, sizeReportToken} from "../../tokens/singleton";

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrl: './chat-history.component.css',
  imports: [
    NzButtonModule,
    NzIconModule,
    HistoryBtComponent,
    NgForOf
  ],
  standalone: true
})
export class ChatHistoryComponent
{
  @Input()
  chatHistoryTitle: ChatHistoryTitle[] | undefined;
  @Output()
  chatHistoryChangeEvent = new EventEmitter<ChatHistoryTitleActionInfo>();
  selectId: number | undefined;
  constructor(
    @Inject(sizeReportToken) private sizeReportService: SizeReportService,
    @Inject(sideBarToken) public sidebarService: SidebarService,
    @Inject(chatSessionSubject) private chatSessionObserver:Observer<number> ,
              @Inject(backChatHistorySubject) private backHistoryObservable: Observable<ChatHistoryTitle>,
              @Inject(lastSessionToken) private lastSession: LastSessionModel,
              ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId!==MagicDataId){
        console.info(`订阅到新的 历史标识 ${historyTitle.dataId} ${historyTitle.title}`);
        this.changeSession(historyTitle.dataId)
      }else{
        this.selectFirst();
      }
    })
  }


  changeSession(dataId: number) {
    this.selectId = dataId;
    this.miniPhoneAction();
    this.chatSessionObserver.next(dataId);
    this.lastSession.sessionId = dataId;


  }
  miniPhoneAction(){
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.isSideBarClosed = true;
    }
  }

  async newChat() {
    this.selectId = -1;
    this.chatSessionObserver.next(-1);
    this.miniPhoneAction();
  }

  selectFirst(){
    const first = this.chatHistoryTitle![0];
    this.selectId = first.dataId;
    this.chatSessionObserver.next(this.selectId);
    this.lastSession.sessionId = this.selectId;
    console.info(`选择历史的第一条 ${first.dataId} ${first.title}`)
  }

  reEmit($event: ChatHistoryTitleActionInfo) {
    this.chatHistoryChangeEvent.emit($event);
  }

  handleHistoryChange($event: number) {
    console.info(`聊天历史列表响应会话更改 ${$event}`);
    this.selectId = $event;
    this.changeSession($event);
  }
}
