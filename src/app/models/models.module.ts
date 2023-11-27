import {NgModule} from "@angular/core";
import {LastSessionModel, LastSessionToken} from "./lastSession.model";
const LASTSESSION = new LastSessionModel();
@NgModule({
  imports:[

  ],
  declarations: [

  ],
  providers: [
    {
      provide: LastSessionToken, useValue: LASTSESSION,
    }
  ],
  exports: [

  ]
})
export class ModelsModule{

}
