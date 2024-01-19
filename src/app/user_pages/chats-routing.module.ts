import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ConfigurationResolver} from "../user_anything/data-services";
import {SystemPromptResolver} from "../user_anything/data-services/system-prompt-resolver.service";

const routes: Routes = [
  {
    path: "", loadComponent: ()=>import("./chat-page/chat-page.component")
      .then(m=>m.ChatPageComponent),

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
        loadComponent:()=>import("./settings/settings.component")
          .then(m=>m.SettingsComponent),
        resolve: {
          model: ConfigurationResolver
        }
      },
      {
        path: "account",
        loadChildren: ()=>import("./accounts/account.module")
          .then(m=>m.AccountModule)
      },
      {
        path: "prompts",
        loadComponent: ()=>import("./prompt-store/prompt-store.component")
          .then(m=>m.PromptStoreComponent),
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
