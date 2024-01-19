import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthCallService} from "./auth-call.service";

@Injectable({
  providedIn: "root"
})
export class VerificationService {

  constructor(private message: NzMessageService,
              private call: AuthCallService) { }

  generateVerificationCode() {
    return this.call.generateVerificationCode().pipe(
      catchError((err:any) => {
        if (err instanceof HttpErrorResponse) {
          this.message.error("获取验证码错误,网络错误")
        }else{
          this.message.error("获取验证码错误",err)
        }
        throw err;
      })
    );
  }
  checkToken(){
    return this.call.check_token();
  }
}
