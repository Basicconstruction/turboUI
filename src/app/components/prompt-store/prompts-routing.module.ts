import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {PromptStoreComponent} from "./prompt-store.component";

const routes: Routes = [
  {
    path: "", component: PromptStoreComponent
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromptsRoutingModule{

}
