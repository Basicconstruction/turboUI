import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ChatHistoryTitleActionInfo, ChatHistoryTitleAction, ChatHistoryTitle} from "../../models";
import {ChatDataService, DbService, HistoryTitleService} from "../../share-datas";
import {backChatHistorySubject} from "../../share-datas/datas.module";
import {min, Subject} from "rxjs";
import {SizeReportService} from "../../services";
import {SidebarService} from "../../services";
import {Router} from "@angular/router";
export const MagicDataId = -2;
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent implements OnInit {

  toggleSidebar(): void {
    this.sidebarService.switch();
  }

  historyTitles: ChatHistoryTitle[] | undefined;
  constructor(private sizeReportService: SizeReportService,
    public sidebarService: SidebarService,
    private router: Router,
    private historyTitleService: HistoryTitleService,
              private chatDataService: ChatDataService,
              private dbService: DbService,
              @Inject(backChatHistorySubject) private backHistoryObservable: Subject<ChatHistoryTitle>,
  ) {
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId===MagicDataId) return;
      const existingItem = this.historyTitles!.find(item => item.dataId === historyTitle.dataId);
      if (!existingItem) {
        this.historyTitles!.splice(0, 0, historyTitle) // 如果不存在具有相同 dataId 的项，则添加 historyTitle
      }
    });
  }

  async ngOnInit() {
    this.sizeReportService.width = window.innerWidth;
    this.sizeReportService.height = window.innerHeight;
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.waitForInit().then(async ()=>{
      this.historyTitles = await this.historyTitleService.getHistoryTitles();
      if (this.historyTitles === undefined) {
        this.historyTitles = [];
      }
      this.historyTitles?.reverse();
    });

  }
  @HostListener('window:resize',['$event'])
  onResize(event: any){
    this.sizeReportService.width = event.target.innerWidth;
    this.sizeReportService.height = event.target.innerHeight;
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
        }, 10);
      }
    });
  }


  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }

  protected readonly min = min;

  openSettingPage() {
    this.router.navigate(['/chat','settings']).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }
  openPromptPage() {
    this.router.navigate(['/chat','prompts']).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }

  async handleChatHistoryAction($event: ChatHistoryTitleActionInfo) {
    switch ($event.action){
      case ChatHistoryTitleAction.Delete:
        const index = this.historyTitles?.findIndex(h=>h.dataId==$event.info.dataId);
        if(index===undefined) return;
        let historyTitle = this.historyTitles![index];
        this.historyTitles?.splice(index,1);
        await this.historyTitleService.deleteHistoryTitle(historyTitle).then(async ()=>{
          await this.chatDataService.deleteHistoriesByTitleId(historyTitle.dataId)
        });
        this.backHistoryObservable.next({
          dataId: MagicDataId,
          title: "none"
        })
        break;
      case ChatHistoryTitleAction.Rename:

        break;
      default:
        break;
    }
  }


}
