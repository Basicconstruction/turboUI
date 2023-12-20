import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChatPageComponent} from "./chat-page/chat-page.component";
import {SettingsComponent} from "./settings/settings.component";
import {ChatMainComponent} from "./chat-main/chat-main.component";
import {ConfigurationResolver} from "../share-datas";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SystemInfoResolver} from "../share-datas/systemInfo.resolver";

const routes: Routes = [
  {
    path: "",component: ChatPageComponent,
    children: [
      {
        path: "",component: ChatMainComponent,
        resolve: {
          model: ConfigurationResolver,
          model2: SystemInfoResolver,
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
      }
    ]
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
