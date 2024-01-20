import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAuthGuard} from "../../admin_anythings/guards";

const routes: Routes = [
  {
    path: '', redirectTo:'sign-in',pathMatch: "full"
  },
  {
    path: 'sign-in', loadComponent: ()=>
      import("./login/sign-in.component")
        .then(c=>c.SignInPageComponent)
  },
  {
    path: 'account-management',
    children: [
      {
        path: '',loadComponent: ()=>
          import("./account-management/account-management.component")
            .then(c=>c.AccountManagementComponent)
      },
      {
        path: 'create', loadComponent: ()=>
          import('./account-management/account-create/account-create.component')
            .then(c=>c.AccountCreateComponent),
        canActivate: [
          AdminAuthGuard
        ]
      },
      {
        path: 'edit/:accountId', loadComponent:()=>
          import('./account-management/account-edit/account-edit.component')
            .then(c=>c.AccountEditComponent),
        canActivate: [
          AdminAuthGuard
        ]
      }
    ]
  },
  {
    path: 'account-info', loadComponent: ()=>
      import('./account-info/account-info.component')
        .then(c=>c.AccountInfoComponent),
    canActivate: [
      AdminAuthGuard
    ]
  },
  {
    path: 'roles', loadComponent: ()=>
      import('./roles/roles.component')
        .then(c=>c.RolesComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
