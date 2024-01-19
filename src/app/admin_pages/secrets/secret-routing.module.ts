import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
const routes: Routes = [
  {
    path: "models", loadComponent: ()=>
      import("./models/models.component")
        .then(m=>m.ModelsComponent)
  },
  {
    path: "keys", loadComponent: ()=>
      import("./keys/keys.component")
        .then(c=>c.KeysComponent)
  },
  {
    path: 'keys/create', loadComponent: ()=>
      import('./keys/key-create/key-create.component')
        .then(c=>c.KeyCreateComponent)
  },
  {
    path: 'keys/edit/:keyId', loadComponent: ()=>
      import('./keys/key-edit/key-edit.component')
        .then(c=>c.KeyEditComponent)
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretRoutingModule{

}
