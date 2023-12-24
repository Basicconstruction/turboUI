import {NgModule, SecurityContext} from "@angular/core";
import {ChatPageComponent} from './chat-page/chat-page.component';
import {ChatsRoutingModule} from "./chats-routing.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {LoginLabelComponent} from './login-label/login-label.component';
import {ChatHistoryComponent} from './chat-history/chat-history.component';
import {DatasModule} from "../share-datas/datas.module";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

@NgModule({
  imports: [
    ChatsRoutingModule,
    DatasModule,
    NzButtonModule,
    NzIconModule,
    ChatHistoryComponent,
    LoginLabelComponent,
    NzSkeletonModule,
  ],
  declarations: [
    ChatPageComponent,
  ],
  exports: [],
  providers: []
})
export class ChatModule {

}
