import {Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ChatHistoryTitleActionInfo, ChatHistoryTitle, LastSessionModel} from "../../models";
import {backChatHistorySubject, chatSessionSubject} from "../../share-datas/datas.module";
import {Observable, Observer} from "rxjs";
import {SizeReportService} from "../../services";
import {SidebarService} from "../../services";
import {MagicDataId} from "../chat-page/chat-page.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {HistoryBtComponent} from "./history-bt/history-bt.component";
import {NgForOf} from "@angular/common";

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
export class ChatHistoryComponent implements OnChanges
{
  @Input()
  chatHistoryTitle: ChatHistoryTitle[] | undefined;
  @Output()
  chatHistoryChangeEvent = new EventEmitter<ChatHistoryTitleActionInfo>();
  selectId: number | undefined;
  constructor(
    private sizeReportService: SizeReportService,
    public sidebarService: SidebarService,
    @Inject(chatSessionSubject) private chatSessionObserver:Observer<number> ,
              @Inject(backChatHistorySubject) private backHistoryObservable: Observable<ChatHistoryTitle>,
              private lastSession: LastSessionModel,
              ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId!==MagicDataId){
        this.changeSession(historyTitle.dataId)
      }else{
        this.selectFirst();
      }
    })
  }


  changeSession(dataId: number) {
    this.selectId = dataId;
    this.chatSessionObserver.next(dataId);
    this.lastSession.sessionId = dataId;
    this.miniPhoneAction();

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

  ngOnChanges(): void {
    if(this.chatHistoryTitle){
      if(this.chatHistoryTitle.length>=1){
        this.selectFirst();
      }
    }
  }
  selectFirst(){
    const first = this.chatHistoryTitle![0];
    this.selectId = first.dataId;
    this.chatSessionObserver.next(this.selectId);
    this.lastSession.sessionId = this.selectId;
  }

  reEmit($event: ChatHistoryTitleActionInfo) {
    this.chatHistoryChangeEvent.emit($event);
  }

  handleHistoryChange($event: number) {
    this.selectId = $event;
    this.changeSession($event);
  }
}
