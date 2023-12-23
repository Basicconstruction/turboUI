import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ErrorPageComponent} from "./components/error-page/error-page.component";

const routes: Routes = [
  {
    path: "", pathMatch: "full", redirectTo: "/chat",
  },
  {
    path: "chat", loadChildren: () => import("./components/chat.module").then(m=>m.ChatModule)
  },
  {
    path: "**", loadComponent: () => import("./components/error-page/./error-page.component")
      .then(m=>m.ErrorPageComponent)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
