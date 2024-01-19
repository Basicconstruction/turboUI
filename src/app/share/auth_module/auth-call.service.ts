import {provide} from "../roots";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Role} from "../models/accounts";

@Injectable(
  {
    providedIn: "root"
  }
)
export class AuthCallService {
  constructor(private http: HttpClient
  ) {

  }

  login(body: any) {
    return this.http.post<any>(`${provide()}/api/auth/login`, body);
  }

  register(body: any) {
    return this.http.post(`${provide()}/api/auth/register`,body);
  }
  check_token(){
    return this.http.get<any>(`${provide()}/api/verification/check-token`);
  }
  generateVerificationCode(){
    return this.http.get(`${provide()}/api/verification/generate`);
  }
  getRolesWithUserId(userId?: number){
    if(userId===undefined){
      return this.http.get<Role[]>(`${provide()}/api/role`);
    }
    return this.http.get<Role[]>(`${provide()}/api/role?userId=${userId}`);
  }
}
