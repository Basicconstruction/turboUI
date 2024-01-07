import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: "root"
})
export class VerificationService {

  constructor(private http: HttpClient,private message: NzMessageService) { }

  generateVerificationCode() {
    return this.http.get(`https://localhost:44301/api/verification/generate`).pipe(
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
    return this.http.post<any>(`https://localhost:44301/api/verification/check-token`,{});
  }
}
