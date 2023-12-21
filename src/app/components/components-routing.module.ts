import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChatPageComponent} from "./chat-page/chat-page.component";
import {SettingsComponent} from "./settings/settings.component";
import {ChatMainComponent} from "./chat-main/chat-main.component";
import {ConfigurationResolver} from "../share-datas";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SystemPromptResolver} from "../share-datas/system-prompt-resolver.service";
import {PromptStoreComponent} from "./prompt-store/prompt-store.component";

const routes: Routes = [
  {
    path: "",component: ChatPageComponent,
    children: [
      {
        path: "",component: ChatMainComponent,
        resolve: {
          model: ConfigurationResolver,
          model2: SystemPromptResolver,
        }
      },
      {
        path: "settings",component: SettingsComponent,
        resolve: {
          model: ConfigurationResolver
        }
      },
      {
        path: "login", component: LoginPageComponent,
      },
      {
        path: "prompts", component: PromptStoreComponent,
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
export class ComponentsRoutingModule { }
