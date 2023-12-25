import {InjectionToken, NgModule} from "@angular/core";
import {ModelsModule} from "../models/models.module";
import {Subject} from "rxjs";
import {ChatHistoryTitle} from "../models";
import {ConfigurationResolver} from "./configuration.resolver";
import {SystemPromptResolver} from "./system-prompt-resolver.service";
export const chatSessionSubject = new InjectionToken("chat-session-subject");
export const backChatHistorySubject = new InjectionToken("back-chat-history-subject");
export const configurationChangeSubject = new InjectionToken("configuration-change");
export const systemPromptChangeSubject = new InjectionToken("system-prompt");
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
    },
    {
      provide: configurationChangeSubject, useValue: new Subject<boolean>()
    },
    {
      provide: systemPromptChangeSubject, useValue: new Subject<boolean>()
    }
  ],
  exports: [

  ]
})
export class DatasModule{

}
