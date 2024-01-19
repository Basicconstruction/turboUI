import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {AccountInformationComponent} from "../user_pages/accounts/account-information/account-information.component";
import {AdminComponent} from "./admin.component";

const routes: Routes = [
  {
    path: 'accounts', pathMatch: 'full',component: AdminComponent,
    children: [
      {
        path: 'account-info', component: AccountInformationComponent
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule{

}
