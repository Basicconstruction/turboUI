import {Component, Inject, OnInit} from '@angular/core';
import {ChatHistoryTitle} from "../../models";
import {DbService, HistoryTitleService} from "../../share-datas";
import {backChatHistorySubject} from "../../share-datas/datas.module";
import {Observable} from "rxjs";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit {
  isSidebarClosed: boolean = false;

  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  historyTitles: ChatHistoryTitle[] | undefined;
  constructor(private historyTitleService: HistoryTitleService,
              private dbService: DbService,
              @Inject(backChatHistorySubject) private backHistoryObservable: Observable<ChatHistoryTitle>,
  ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      const existingItem = this.historyTitles!.find(item => item.dataId === historyTitle.dataId);
      if (!existingItem) {
        this.historyTitles!.splice(0, 0, historyTitle) // 如果不存在具有相同 dataId 的项，则添加 historyTitle
      }
    });
  }

  async ngOnInit() {
    await this.waitForInit();
    this.historyTitles = await this.historyTitleService.getHistoryTitles();
    if (this.historyTitles === undefined) {
      this.historyTitles = [];
    }
    this.historyTitles?.reverse();
  }
  private waitForInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.dbService.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.dbService.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

}
