import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "../../share/guards/auth.guard";

const routes: Routes = [
  {
    path: '', redirectTo:'account-info',pathMatch: "full"
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
          AuthGuard
        ]
      },
      {
        path: 'edit/:accountId', loadComponent:()=>
          import('./account-management/account-edit/account-edit.component')
            .then(c=>c.AccountEditComponent),
        canActivate: [
          AuthGuard
        ]
      }
    ]
  },
  {
    path: 'account-info', loadComponent: ()=>
      import('./account-info/account-info.component')
        .then(c=>c.AccountInfoComponent),
    canActivate: [
      AuthGuard
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
