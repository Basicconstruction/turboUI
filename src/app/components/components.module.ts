import {NgModule} from "@angular/core";
import { ChatPageComponent } from './chat-page/chat-page.component';
import {AuthModule} from "../auth/auth.module";
import {ComponentsRoutingModule} from "./components-routing.module";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {HttpClientModule} from "@angular/common/http";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {
  NgClass,
  NgForOf,
  NgIf,
  NgOptimizedImage,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault, NgTemplateOutlet
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
import { ImageComponent } from './dialogue/image/image.component';
import { ChatComponent } from './dialogue/chat/chat.component';
import { TtsComponent } from './dialogue/tts/tts.component';
import { SttComponent } from './dialogue/stt/stt.component';
import { StaticRequestComponent } from './dialogue/static-request/static-request.component';
import { TtsBannerComponent } from './chat-main/tts-banner/tts-banner.component';
import { SttBannerComponent } from './chat-main/stt-banner/stt-banner.component';
import { StaticImageComponent } from './dialogue/static-image/static-image.component';
import { StaticTtsComponent } from './dialogue/static-tts/static-tts.component';
import { VisionBannerComponent } from './chat-main/vision-banner/vision-banner.component';
import {NzBackTopModule} from "ng-zorro-antd/back-top";
import {
  CLIPBOARD_OPTIONS,
  ClipboardButtonComponent,
  MarkdownModule,
} from "ngx-markdown";
import { MarkdownRootComponent } from './dialogue/markdown-root/markdown-root.component';
import {ServicesModule} from "../services/services.module";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzModalModule} from "ng-zorro-antd/modal";
import { ModelEditorComponent } from './chat-main/model-editor/model-editor.component';
import { DallBannerComponent } from './chat-main/dall-banner/dall-banner.component';
import { HistoryBtComponent } from './chat-history/history-bt/history-bt.component';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { ConfigExportComponent } from './settings/config-export/config-export.component';
import { ConfigImportComponent } from './settings/config-import/config-import.component';
import { CopiedButtonComponent } from './dialogue/markdown-root/copied-button/copied-button.component';
import {TableBorderDirective} from "./dialogue/markdown-root/TableBorderDirective";
import { SystemWordChoiceComponent } from './chat-main/system-word-choice/system-word-choice.component';
import { SystemPromptManagerComponent } from './chat-main/system-prompt-manager/system-prompt-manager.component';
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import { PromptStoreComponent } from './prompt-store/prompt-store.component';
import { ExportPromptsComponent } from './prompt-store/export-prompts/export-prompts.component';
import { ImportPromptsComponent } from './prompt-store/import-prompts/import-prompts.component';
import {ClipboardModule} from "ngx-clipboard";
import { CreatePromptComponent } from './prompt-store/create-prompt/create-prompt.component';
import { LookUpdatePromptComponent } from './prompt-store/look-update-prompt/look-update-prompt.component';
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
    AuthModule, ComponentsRoutingModule, NzInputModule, FormsModule, NzButtonModule, NzCardModule
    , HttpClientModule, NzTypographyModule, NgClass, NzIconModule,
    FetchModule,
    NgIf, NzUploadModule, NzRadioModule, NgForOf, NzImageModule, NzImageModule, NgOptimizedImage,
    DatasModule, NzAvatarModule, NzTreeSelectModule, NzSelectModule, NzSliderModule, NzFormModule,
    NzInputNumberModule, NgStyle, NzPopoverModule, NgSwitch, NgSwitchCase, NgSwitchDefault,
    NzSpinModule, NzPopconfirmModule, NzBackTopModule,
    ServicesModule, NzToolTipModule, NzModalModule, NzDropDownModule,
    ConfigExportComponent, ConfigImportComponent,
    NgTemplateOutlet, NzSwitchModule, NzSkeletonModule,
    ClipboardModule, ReactiveFormsModule
  ],
  declarations: [
    ChatPageComponent,
    LoginLabelComponent,
    ChatHistoryComponent,
    LoginPageComponent,
    ErrorPageComponent,
    ChatMainComponent,
    DialogueComponent,
    ModelSelectorComponent,
    ImageComponent,
    ChatComponent,
    TtsComponent,
    SttComponent,
    StaticRequestComponent,
    TtsBannerComponent,
    SttBannerComponent,
    StaticImageComponent,
    StaticTtsComponent,
    VisionBannerComponent,
    MarkdownRootComponent,
    ModelEditorComponent,
    DallBannerComponent,
    HistoryBtComponent,
    SettingsComponent,
    CopiedButtonComponent,
    TableBorderDirective,
    SystemWordChoiceComponent,
    SystemPromptManagerComponent,
    PromptStoreComponent,
    ExportPromptsComponent,
    ImportPromptsComponent,
    CreatePromptComponent,
    LookUpdatePromptComponent
  ],
  exports: [
    ChatPageComponent
  ],
  providers: [
  ]
})
export class ComponentsModule{

}
