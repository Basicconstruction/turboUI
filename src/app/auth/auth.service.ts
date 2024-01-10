import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { User } from "../models/accounts/user";
import {catchError} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthModule} from "./auth.module";
import {provide} from "./base.provider";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private url = `${provide()}/api/account/login`;
  private tokenKey = 'auth_token';
  private userKey: string = "auth_user";
  public user: User | undefined;
  public token: string | undefined;

  constructor(private http: HttpClient,private message: NzMessageService) {
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
    return this.http.post<any>(this.url, body).pipe(
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
    )
      ;
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
