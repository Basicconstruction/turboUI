import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ErrorPageComponent} from "../user_pages/error-page/error-page.component";
import {AuthGuard} from "../share/guards/auth.guard";

const routes: Routes = [
  {
    path: '', pathMatch: 'full', loadComponent: () =>
      import('./admin.component')
        .then(c=>c.AdminComponent),
    children: [
      {
        path: '', redirectTo: 'accounts', pathMatch: "full"
      },
      {
        path: 'accounts',
        children: [
          {
            path: '', redirectTo:'account-info',pathMatch: "full"
          },
          {
            path: 'sign-in', loadComponent: ()=>
              import("./accounts/login/sign-in.component")
                .then(c=>c.SignInPageComponent)
          },
          {
            path: 'account-management',
            children: [
              {
                path: '',loadComponent: ()=>
                  import("./accounts/account-management/account-management.component")
                    .then(c=>c.AccountManagementComponent)
              },
              {
                path: 'create', loadComponent: ()=>
                  import('./accounts/account-management/account-create/account-create.component')
                    .then(c=>c.AccountCreateComponent),
                canActivate: [
                  AuthGuard
                ]
              },
              {
                path: 'edit/:accountId', loadComponent:()=>
                  import('./accounts/account-management/account-edit/account-edit.component')
                    .then(c=>c.AccountEditComponent),
                canActivate: [
                  AuthGuard
                ]
              }
            ]
          },
          {
            path: 'account-info', loadComponent: ()=>
              import('./accounts/account-info/account-info.component')
                .then(c=>c.AccountInfoComponent),
            canActivate: [
              AuthGuard
            ]
          },
          {
            path: 'roles', loadComponent: ()=>
              import('./accounts/roles/roles.component')
                .then(c=>c.RolesComponent)
          }
        ]
      },
      {
        path: 'secrets',
        loadChildren: ()=>
          import('./secrets/secret.module')
            .then(m=>m.SecretModule)
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
