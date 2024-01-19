import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {User} from "../models/accounts";
import {AuthCallService} from "./auth-call.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey: string = "auth_user";
  public user: User | undefined;
  public token: string | undefined;

  constructor(private message: NzMessageService,
              private call: AuthCallService) {
    this.resume();
  }
  resume(){
    let iToken = localStorage.getItem(this.tokenKey);
    if(iToken!=null) this.token = iToken;
    let iUser = localStorage.getItem(this.userKey);
    if(iUser!=null) this.user = JSON.parse(iUser);
  }
  get isLogin(): boolean {
    return this.token !== undefined;
  }

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password
    };
    return this.call.login(body).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            // 密码错误
            this.message.create('error', `用户名或者密码错误`);
          } else {
            // 网络错误
            this.message.create('error', `网络错误，请稍后重试`);
          }
        }
        throw error;
      })
    );
  }
  store(){
    this.restore(this.user!,this.token!);
  }
  restore(user: User, token: string) {
    this.user = user;
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(this.user));
  }

  logout(){
    this.token = undefined;
    this.user = undefined;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
