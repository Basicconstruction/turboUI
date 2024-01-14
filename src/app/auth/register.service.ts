import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {provide} from "./base.provider";
import {CallService} from "./call.service";

@Injectable({
  providedIn: "root"
})
export class RegisterService{
  constructor(private http: HttpClient,private message: NzMessageService,
              private call: CallService) {
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
