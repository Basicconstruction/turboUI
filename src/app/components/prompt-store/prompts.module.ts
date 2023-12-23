import {NgModule} from "@angular/core";
import {PromptStoreComponent} from "./prompt-store.component";
import {ExportPromptsComponent} from "./export-prompts/export-prompts.component";
import {ImportPromptsComponent} from "./import-prompts/import-prompts.component";
import {CreatePromptComponent} from "./create-prompt/create-prompt.component";
import {LookUpdatePromptComponent} from "./look-update-prompt/look-update-prompt.component";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ConfigExportComponent} from "../settings/config-export/config-export.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {ConfigImportComponent} from "../settings/config-import/config-import.component";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {RouterLink} from "@angular/router";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {ClipboardModule} from "ngx-clipboard";
import {PromptsRoutingModule} from "./prompts-routing.module";

@NgModule({
  imports: [
    PromptsRoutingModule,

    NzFormModule,
    NzModalModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzPopoverModule,
    NzInputNumberModule,
    NzSliderModule,
    FormsModule,
    NzInputModule,
    RouterLink,
    NgStyle,
    NzSelectModule,
    NgForOf,
    NzSkeletonModule,
    NgIf,
    ReactiveFormsModule,
    NzUploadModule,
    ClipboardModule
  ],
  declarations: [
    PromptStoreComponent,
    ExportPromptsComponent,
    ImportPromptsComponent,
    CreatePromptComponent,
    LookUpdatePromptComponent
  ],
  providers: [

  ],
  exports: [

  ]
})
export class PromptsModule{

}
