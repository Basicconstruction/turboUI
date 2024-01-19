import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
const routes: Routes = [
  {
    path: "", loadComponent: ()=> import('./account/account.component').then(m=>m.AccountComponent),
    children: [
      {
        path: "", pathMatch: "full",redirectTo: "account-info",
      },
      {
        path: "account-info", loadComponent: ()=>import("./account-information/account-information.component")
          .then(m=>m.AccountInformationComponent),
      },
      {
        path: "sign-in", loadComponent: ()=>import("./sign-in-page/sign-in-page.component")
          .then(m=>m.SignInPageComponent),
      },
      {
        path: "register", loadComponent: ()=>import("./register/register.component")
          .then(m=>m.RegisterComponent),
      },
      {
        path: "forgot-me-password", loadComponent: ()=>import("./forgot-my-password/forgot-my-password.component")
          .then(m=>m.ForgotMyPasswordComponent)
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {

}
