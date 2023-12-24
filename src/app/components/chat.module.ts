import {NgModule} from "@angular/core";
import { ChatPageComponent } from './chat-page/chat-page.component';
import {ChatsRoutingModule} from "./chats-routing.module";
import {NzButtonModule} from "ng-zorro-antd/button";
import {
  NgIf,
} from "@angular/common";
import {NzIconModule} from "ng-zorro-antd/icon";
import { LoginLabelComponent } from './login-label/login-label.component';
import { ChatHistoryComponent } from './chat-history/chat-history.component';
import {
  CLIPBOARD_OPTIONS,
  ClipboardButtonComponent,
  MarkdownModule,
} from "ngx-markdown";
import {DatasModule} from "../share-datas/datas.module";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
@NgModule({
    imports: [
        MarkdownModule.forRoot({
            clipboardOptions: {
                provide: CLIPBOARD_OPTIONS,
                useValue: {
                    buttonComponent: ClipboardButtonComponent,
                },
            },
        }),
        ChatsRoutingModule,
        DatasModule,
        NzButtonModule,
        NzIconModule,
        NgIf,
        ChatHistoryComponent,
        LoginLabelComponent,
        NzSkeletonModule,
    ],
  declarations: [
    ChatPageComponent,
  ],
  exports: [

  ],
  providers: [
  ]
})
export class ChatModule {

}
