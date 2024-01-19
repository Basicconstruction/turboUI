import {Injectable} from "@angular/core";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthCallService} from "./auth-call.service";

@Injectable({
  providedIn: "root"
})
export class RegisterService{
  constructor(private message: NzMessageService,
              private call: AuthCallService) {
  }
  register(body: any){
    return this.call.register(body)
      .pipe(
        catchError((err: any)=>{
          this.message.error(`${err.status} ${err.error}`)
          throw err;
        })
      );
  }
}
