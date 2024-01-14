import {provide} from "./base.provider";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Role} from "../models/accounts/role";

@Injectable(
  {
    providedIn: "root"
  }
)
export class CallService {
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
  getRolesByUserId(id: number){
    return this.http.get<Role[]>(`${provide()}/api/role/user/${id}`);
  }
}
