import {InjectionToken, NgModule} from "@angular/core";
import {ModelsModule} from "../models/models.module";
import {Db, DbService} from "./db.service";
import {ChatDataService} from "./chatData.service";
import {ConfigurationService} from "./configuration.service";
import {HistoryTitleService} from "./historyTitle.service";
import {Subject} from "rxjs";
import {ChatHistoryTitle} from "../models";
import {ConfigurationResolver} from "./configuration.resolver";
export const chatSessionSubject = new InjectionToken("chat-session-subject");
export const backChatHistorySubject = new InjectionToken("back-chat-history-subject");
@NgModule({
  imports:[
    ModelsModule,
  ],
  declarations: [

  ],
  providers: [
    {
      provide: Db,
      useValue: new DbService()
    },
    ChatDataService,
    ConfigurationService,
    HistoryTitleService,
    {
      provide: chatSessionSubject,useValue: new Subject<number>(),
    },
    {
      provide: backChatHistorySubject, useValue: new Subject<ChatHistoryTitle>()
    },ConfigurationResolver
  ],
  exports: [

  ]
})
export class DatasModule{

}
