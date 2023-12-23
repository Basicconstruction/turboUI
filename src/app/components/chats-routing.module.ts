import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChatPageComponent} from "./chat-page/chat-page.component";
import {ConfigurationResolver} from "../share-datas";
import {SystemPromptResolver} from "../share-datas/system-prompt-resolver.service";

const routes: Routes = [
  {
    path: "",component: ChatPageComponent,
    children: [
      {
        path: "", loadComponent: ()=>import('./chat-main/chat-main.component')
          .then(m=>m.ChatMainComponent),
        resolve: {
          model: ConfigurationResolver,
          model2: SystemPromptResolver,
        }
      },
      {
        path: "settings",
        loadChildren:()=>import("./settings/setting.module")
          .then(m=>m.SettingModule),
        resolve: {
          model: ConfigurationResolver
        }
      },
      {
        path: "login",
        loadComponent: ()=>import("./login-page/login-page.component")
          .then(m=>m.LoginPageComponent),
      },
      {
        path: "prompts",
        loadChildren: ()=>import("./prompt-store/prompts.module")
          .then(m=>m.PromptsModule),
        resolve: {
          model: SystemPromptResolver,
        }
      }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsRoutingModule { }
