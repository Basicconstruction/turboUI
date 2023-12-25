import {NgModule} from "@angular/core";
import {ChatsRoutingModule} from "./chats-routing.module";
import {DatasModule} from "../share-datas/datas.module";
import {ConfigurationResolver} from "../share-datas";
import {SystemPromptResolver} from "../share-datas/system-prompt-resolver.service";

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
  ]
})
export class ChatModule {

}
