import {NgModule} from "@angular/core";
import {ChatsRoutingModule} from "./chats-routing.module";
import {
  DatasModule,
} from "../share-datas/datas.module";
import {ConfigurationResolver} from "../share-datas";
import {SystemPromptResolver} from "../share-datas/system-prompt-resolver.service";
import {Subject} from "rxjs";
import {ChatHistoryTitle, LastSessionModel} from "../models";
import {
  backChatHistorySubject,
  chatSessionSubject,
  configurationChangeSubject,
  systemPromptChangeSubject
} from "../tokens/subject.data";
import {lastSessionToken, sideBarToken, sizeReportToken} from "../tokens/singleton";
import {SidebarService, SizeReportService} from "../services";

@NgModule({
  imports: [
    ChatsRoutingModule,
    DatasModule,
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
