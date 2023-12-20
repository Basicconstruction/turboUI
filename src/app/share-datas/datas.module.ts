import {InjectionToken, NgModule} from "@angular/core";
import {ModelsModule} from "../models/models.module";
import {Subject} from "rxjs";
import {ChatHistoryTitle} from "../models";
import {ConfigurationResolver} from "./configuration.resolver";
import {SystemInfoResolver} from "./systemInfo.resolver";
export const chatSessionSubject = new InjectionToken("chat-session-subject");
export const backChatHistorySubject = new InjectionToken("back-chat-history-subject");
export const configurationChangeSubject = new InjectionToken("configuration-change");
@NgModule({
  imports:[
  ],
  declarations: [

  ],
  providers: [
    {
      provide: chatSessionSubject,useValue: new Subject<number>(),
    },
    {
      provide: backChatHistorySubject, useValue: new Subject<ChatHistoryTitle>()
    },ConfigurationResolver,
    SystemInfoResolver,
    {
      provide: configurationChangeSubject, useValue: new Subject<boolean>()
    },
  ],
  exports: [

  ]
})
export class DatasModule{

}
