import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "", pathMatch: "full", redirectTo: "/chat",
  },
  {
    path: "chat", loadChildren: () => import("./user_pages/chat.module").then(m=>m.ChatModule)
  },
  // {
  //   path: "image-studio",
  // },
  // {
  //   path: 'admin',
  // },
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
