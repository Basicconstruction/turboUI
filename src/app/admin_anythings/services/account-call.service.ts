import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Account} from "../models/accounts";
import {provide} from "../../share/roots";
import {Role} from "../../share/models/accounts";
@Injectable(
  {
    providedIn: "root"
  }
)
export class AccountCallService {
  constructor(private http: HttpClient
  ) {

  }
  login(body: any){
    return this.http.post<any>(`${provide()}api/auth/login`, body);
  }
  getRolesWithUserId(userId?: number){
    if(userId===undefined){
      return this.http.get<Role[]>(`${provide()}api/role`);
    }
    return this.http.get<Role[]>(`${provide()}api/role?userId=${userId}`);
  }
  getAccountsWithRole(roleId?: number) {
    if(roleId===undefined){
      return this.http.get<Account[]>(`${provide()}api/account`);
    }
    return this.http.get<Account[]>(`${provide()}api/account?roleId=${roleId}`);
  }
  getAccountById(id: number){
    return this.http.get<Account>(`${provide()}api/account/${id}`);
  }
  deleteAccountById(id: number){
    return this.http.delete<any>(`${provide()}api/account/${id}`);
  }
  addRole(name: string){
    return this.http.post<any>(`${provide()}api/role`, {name: name})
  }
  deleteRoleById(id: number){
    return this.http.delete(`${provide()}api/role/${id}`);
  }
  updateRole(role: Role){
    return this.http.put(`${provide()}api/role/${role.roleId}`,role);
  }

  addAccount(account: Account) {
    return this.http.post<any>(`${provide()}api/account`, account)
  }
  updateAccount(account: Account){
    return this.http.put(`${provide()}api/account/${account.accountId}`,account);
  }
}
