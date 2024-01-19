import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";

@NgModule({

  imports: [
    AdminRoutingModule,
  ],
  exports: [
  ],
  declarations: [

  ],
  providers: [

  ]
})
export class AdminModule{

}
