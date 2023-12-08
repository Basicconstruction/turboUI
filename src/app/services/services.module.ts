import {InjectionToken, NgModule} from "@angular/core";
import {ContextMemoryService} from "./contextMemory.service";
export const contextMemoryToken = new InjectionToken("context-memory-service");
@NgModule({
  imports: [

  ],
  declarations: [

  ],
  providers: [
    {
      provide: contextMemoryToken, useValue: new ContextMemoryService()
    }
  ],
  exports: [

  ]

})
export class ServicesModule{

}
