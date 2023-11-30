import {NgModule} from "@angular/core";
import { ChatPageComponent } from './chat-page/chat-page.component';
import {AuthModule} from "../auth/auth.module";
import {ComponentsRoutingModule} from "./components-routing.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {HttpClientModule} from "@angular/common/http";
import {OpenaiService} from "../fetch";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {HIGHLIGHT_OPTIONS, HighlightModule} from "ngx-highlightjs";
import {
  NgClass,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault
} from "@angular/common";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FetchModule} from "../fetch/fetch.module";
import { LoginLabelComponent } from './login-label/login-label.component';
import { ChatHistoryComponent } from './chat-history/chat-history.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzImageModule} from "ng-zorro-antd/image";
import {DatasModule} from "../share-datas/datas.module";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import { SettingsComponent } from './settings/settings.component';
import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import { ModelSelectorComponent } from './chat-main/model-selector/model-selector.component';
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";

@NgModule({
  imports: [
    // AppRoutingModule,
    AuthModule, ComponentsRoutingModule, NzInputModule, FormsModule, NzButtonModule, NzCardModule
    , HttpClientModule, NzTypographyModule, HighlightModule, NgClass, NzIconModule,
    FetchModule,
    NgIf, NzUploadModule, NzRadioModule, NgForOf, NzImageModule, NzImageModule, NgOptimizedImage,
    DatasModule, NzAvatarModule, NzTreeSelectModule, NzSelectModule, NzSliderModule, NzFormModule, NzInputNumberModule, NgStyle, NzPopoverModule, NgSwitch, NgSwitchCase, NgSwitchDefault, NzSpinModule, NzPopconfirmModule
  ],
  declarations: [
    ChatPageComponent,
    LoginLabelComponent,
    ChatHistoryComponent,
    LoginPageComponent,
    ErrorPageComponent,
    ChatMainComponent,
    DialogueComponent,
    SettingsComponent,
    ModelSelectorComponent
  ],
  exports: [
    ChatPageComponent
  ],
  providers: [
    // {
    //   provide: Clipboard,useValue: Clipboard
    // },
    OpenaiService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        lineNumbers: true,
        fullLibraryLoader: () => import('highlight.js')
      },
    }
  ]
})
export class ComponentsModule{

}
