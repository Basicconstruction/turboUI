import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";

@Injectable({
  providedIn: "root"
})
export class RegisterService{
  constructor(private http: HttpClient,private message: NzMessageService) {
  }
  register(body: any){
    return this.http.post(`https://localhost:44301/api/account/register`,body)
      .pipe(
        catchError((err: any)=>{
          this.message.error(`${err.status} ${err.error}`)
          throw err;
        })
      );
  }
}
