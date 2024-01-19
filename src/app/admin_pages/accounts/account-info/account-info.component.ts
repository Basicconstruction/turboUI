import {Component} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NzCardComponent} from "ng-zorro-antd/card";
import {AuthService, VerificationService} from "../../../share/auth_module";
import {AccountCallService} from "../../../admin_anythings/services";

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    NzCardComponent
  ],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.css'
})
export class AccountInfoComponent {
  constructor(private message: NzMessageService,
              private verificationService: VerificationService,
              private router: Router,
              private authService: AuthService,
              private call: AccountCallService) {

  }

  get user() {
    return this.authService.user;
  }

  ngOnInit() {
    this.verificationService.checkToken().pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.message.error("身份信息已经过期，请重新登录");
            this.router.navigate(["/accounts", "sign-in"]);
          }
        } else {
          this.message.error("网络错误")
        }
        throw err;
      })
    ).subscribe({
      next: value => {
        this.message.success("验证成功");
        // console.log("ok")
      }
    });
    if (this.authService.user!.roles === undefined) {
      this.call.getRolesWithUserId(this.authService.user!.id)
        .subscribe({
          next: roles => {
            this.authService.user!.roles = roles;
            this.authService.store();
          }
        })
    }
  }

  logout() {
    this.authService.logout();
    this.ngOnInit();
  }
}
