import {NgModule} from "@angular/core";
import {LoginPageComponent} from "./login-page.component";
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
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {RouterLink} from "@angular/router";
import {NgForOf, NgStyle} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";
import {LoginsRoutingModule} from "./logins-routing.module";

@NgModule({
  imports:[
    LoginsRoutingModule,

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
    NgForOf
  ],
  declarations: [
    LoginPageComponent
  ],
  providers: [

  ],
  exports: [

  ]
})
export class RightsLoginsModule{

}
