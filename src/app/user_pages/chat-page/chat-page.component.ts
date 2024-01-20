import {Component, HostListener, Inject, OnInit, SkipSelf} from '@angular/core';
import {ChatDataService, ConfigurationService, DbService, HistoryTitleService} from "../../user_anything/data-services";
import {min, Observable, Subject} from "rxjs";
import {SizeReportService, ThemeSwitcherService} from "../../user_anything/services";
import {SidebarService} from "../../user_anything/services";
import {Router, RouterOutlet} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ChatHistoryComponent} from "../chat-history/chat-history.component";
import {AccountLabelComponent} from "../accounts/account-label/account-label.component";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {backChatHistorySubject, configurationChangeSubject} from "../../user_anything/injection_tokens";
import {sideBarToken, sizeReportToken} from "../../user_anything/injection_tokens";
import {TranslateModule} from "@ngx-translate/core";
import {DynamicConfigService} from "../../user_anything/services";
import {SignInPageComponent} from "../accounts/sign-in-page/sign-in-page.component";
import {
  ChatHistoryTitle,
  Configuration
} from "../../user_anything/models";
import {ChatHistoryTitleAction, ChatHistoryTitleActionInfo} from "../../user_anything/models/operations";
import {user_routes} from "../../user_anything/routes";
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
    AccountLabelComponent,
    NzSkeletonModule,
    RouterOutlet,
    TranslateModule,
    SignInPageComponent,
  ],
  providers: [
    ThemeSwitcherService,
    DynamicConfigService,
    SizeReportService,
    SidebarService
  ]
})
export class ChatPageComponent implements OnInit {

  toggleSidebar(): void {
    this.sidebarService.switch();
  }
  configuration: Configuration | undefined;
  historyTitles: ChatHistoryTitle[] | undefined;
  constructor(@Inject(sizeReportToken) private sizeReportService: SizeReportService,
    @Inject(sideBarToken) public sidebarService: SidebarService,
    private router: Router,
    private historyTitleService: HistoryTitleService,
              private chatDataService: ChatDataService,
              private dbService: DbService,
              @Inject(backChatHistorySubject) private backHistoryObservable: Subject<ChatHistoryTitle>,
              private dynamicConfigService: DynamicConfigService,
              private configurationService: ConfigurationService,
              @Inject(configurationChangeSubject) private configObservable: Observable<Configuration>
              ) {
    this.initThemeAndLanguage();
    this.configObservable.subscribe(()=>{
      this.initThemeAndLanguage();
    });
    this.backHistoryObservable.subscribe(async (historyTitle) => {
      if(historyTitle.dataId===MagicDataId) return;
      const existingItem = this.historyTitles!.find(item => item.dataId === historyTitle.dataId);
      if (!existingItem) {
        this.historyTitles!.splice(0, 0, historyTitle)
        // 如果不存在具有相同 dataId 的项，则添加 historyTitle
      }
    });
  }
  initThemeAndLanguage(){
    this.configuration = this.configurationService.configuration!;
    let configDynamic = this.dynamicConfigService.getDynamicConfig(this.configuration);
    this.dynamicConfigService.initDynamic(configDynamic);
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
    this.router.navigate(user_routes.settings).then(
      ()=>{

      }
    );
  }
  openPromptPage() {
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.router.navigate(user_routes.prompts).then(
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
