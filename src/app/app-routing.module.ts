import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from "./admin_pages/admin.component";

const routes: Routes = [
  {
    path: "", pathMatch: "full", redirectTo: "/chat",
  },
  {
    path: "chat", loadChildren: () => import("./user_pages/chat.module").then(m=>m.ChatModule)
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'accounts'
      },
      {
        path: 'accounts', loadChildren: () =>
          import('./admin_pages/accounts/account.module').then(m => m.AccountModule)
      },
      {
        path: 'secrets', loadChildren: ()=>
          import('./admin_pages/secrets/secret.module')
            .then(m=>m.SecretModule)
      }
    ]
  },
  {
    path: "**", loadComponent: () => import("./user_pages/error-page/./error-page.component")
      .then(m=>m.ErrorPageComponent)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
