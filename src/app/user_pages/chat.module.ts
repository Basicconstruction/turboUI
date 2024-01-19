import {NgModule} from "@angular/core";
import {ChatsRoutingModule} from "./chats-routing.module";
import {
  DatasModule,
} from "../user_anything/data-services/datas.module";
import {Subject} from "rxjs";
import {
  backChatHistorySubject,
  chatSessionSubject,
  configurationChangeSubject,
  systemPromptChangeSubject
} from "../user_anything/injection_tokens";
import {lastSessionToken, sideBarToken, sizeReportToken} from "../user_anything/injection_tokens";
import {SidebarService, SizeReportService} from "../user_anything/services";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {TranslateModule} from "@ngx-translate/core";
import {ChatHistoryTitle, LastSessionModel} from "../user_anything/models";
import {ConfigurationResolver} from "../user_anything/data-services";
import {SystemPromptResolver} from "../user_anything/data-services/system-prompt-resolver.service";

@NgModule({
  imports: [
    ChatsRoutingModule,
    DatasModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzWaveModule,
    TranslateModule,
  ],
  declarations: [
  ],
  exports: [],
  providers: [
    ConfigurationResolver,
    SystemPromptResolver,
    {
      provide: chatSessionSubject,useValue: new Subject<number>(),
    },
    {
      provide: backChatHistorySubject, useValue: new Subject<ChatHistoryTitle>()
    },
    {
      provide: configurationChangeSubject, useValue: new Subject<boolean>()
    },
    {
      provide: systemPromptChangeSubject, useValue: new Subject<boolean>()
    },
    {
      provide: sideBarToken, useValue: new SidebarService()
    },
    {
      provide: sizeReportToken, useValue: new SizeReportService(),
    },
    {
      provide: lastSessionToken, useValue: new LastSessionModel(),
    },
  ]
})
export class ChatModule {

}
