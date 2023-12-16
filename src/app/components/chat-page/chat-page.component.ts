import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {ChatHistoryTitle} from "../../models";
import {DbService, HistoryTitleService} from "../../share-datas";
import {backChatHistorySubject} from "../../share-datas/datas.module";
import {min, Observable} from "rxjs";
import {SizeReportService} from "../../services/sizeReport.service";
import {SidebarService} from "../../services/sidebar.service";
import {Router} from "@angular/router";

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
    this.sizeReportService.width = window.innerWidth;
    this.sizeReportService.height = window.innerHeight;
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    await this.waitForInit();
    this.historyTitles = await this.historyTitleService.getHistoryTitles();
    if (this.historyTitles === undefined) {
      this.historyTitles = [];
    }
    this.historyTitles?.reverse();
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
        }, 100);
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
}
