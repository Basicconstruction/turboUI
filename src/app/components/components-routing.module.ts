import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ChatPageComponent} from "./chat-page/chat-page.component";
import {SettingsComponent} from "./settings/settings.component";
import {ChatMainComponent} from "./chat-main/chat-main.component";
import {ConfigurationResolver} from "../share-datas/configuration.resolver";

const routes: Routes = [
  {
    path: "",component: ChatPageComponent,
    children: [
      {
        path: "",component: ChatMainComponent,
        resolve: {
          model: ConfigurationResolver
        }
      },
      {
        path: "settings",component: SettingsComponent,
        resolve: {
          model: ConfigurationResolver
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
