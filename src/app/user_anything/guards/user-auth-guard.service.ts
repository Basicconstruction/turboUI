import {Injectable} from "@angular/core";
import {NzMessageService} from "ng-zorro-antd/message";
import {AuthService} from "../../share/auth_module";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {user_routes} from "../routes";

@Injectable({
  providedIn: "root"
})
export class UserAuthGuardService {
  constructor(private message: NzMessageService,
              private authService: AuthService,
              private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot):Promise<boolean>|boolean{
    if(this.authService.isLogin){
      return true;
    }else{
      this.message.error("还没有登录哦");
      this.router.navigate(user_routes.sign_in);
      return false;
    }
  }
}
