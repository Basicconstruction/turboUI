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
export const configurationChangeSubject = new InjectionToken("configuration-change");
export const configurationServiceToken = new InjectionToken("configuration-service");
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
    HistoryTitleService,
    {
      provide: chatSessionSubject,useValue: new Subject<number>(),
    },
    {
      provide: backChatHistorySubject, useValue: new Subject<ChatHistoryTitle>()
    },ConfigurationResolver,
    {
      provide: configurationChangeSubject, useValue: new Subject<boolean>()
    },
    {
      provide: configurationServiceToken, useClass: ConfigurationService
    }
  ],
  exports: [

  ]
})
export class DatasModule{

}
