import {NgModule} from "@angular/core";
import {auth, AuthService} from "./auth.service";
const authService = new AuthService();
@NgModule({
  imports:[
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    {
      provide: auth, useValue: authService
    }
  ]
})
export class AuthModule{

}
