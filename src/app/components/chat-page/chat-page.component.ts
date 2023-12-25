import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ChatHistoryTitleActionInfo, ChatHistoryTitleAction, ChatHistoryTitle} from "../../models";
import {ChatDataService, DbService, HistoryTitleService} from "../../share-datas";
import {min, Subject} from "rxjs";
import {SizeReportService} from "../../services";
import {SidebarService} from "../../services";
import {Router, RouterOutlet} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ChatHistoryComponent} from "../chat-history/chat-history.component";
import {LoginLabelComponent} from "../login-label/login-label.component";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {backChatHistorySubject} from "../../tokens/subject.data";
import {sideBarToken, sizeReportToken} from "../../tokens/singleton";
export const MagicDataId = -2;
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
  standalone: true,
  imports: [
    NzButtonModule,
    NzIconModule,
    ChatHistoryComponent,
    LoginLabelComponent,
    NzSkeletonModule,
    RouterOutlet,
  ]
})
export class ChatPageComponent implements OnInit {

  toggleSidebar(): void {
    this.sidebarService.switch();
  }

  historyTitles: ChatHistoryTitle[] | undefined;
  constructor(@Inject(sizeReportToken) private sizeReportService: SizeReportService,
    @Inject(sideBarToken) public sidebarService: SidebarService,
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
        this.historyTitles!.splice(0, 0, historyTitle)
        // 如果不存在具有相同 dataId 的项，则添加 historyTitle
      }
    });
  }

  async ngOnInit() {
    this.sizeReportService.width = window.innerWidth;
    this.sizeReportService.height = window.innerHeight;
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.dbService.waitForDbInit().then(async ()=>{
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

  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }

  protected readonly min = min;

  openSettingPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.router.navigate(['/chat','settings']).then(
      ()=>{

      }
    );
  }
  openPromptPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.router.navigate(['/chat','prompts']).then(
      ()=>{

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
        // 推送一个额特殊的 消息，表示历史列表发生了改变
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
