import {Component} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {VerificationService} from "../../../auth";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {NzCardComponent} from "ng-zorro-antd/card";
import {AuthService} from "../../../auth";
import {Role} from "../../../models/accounts/role";
import {CallService} from "../../../auth/call.service";

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrl: './account-information.component.css',
  imports: [
    NzCardComponent
  ],
  standalone: true
})
export class AccountInformationComponent {
  constructor(private message: NzMessageService,
              private verificationService: VerificationService,
              private router: Router,
              private authService: AuthService,
              private call:CallService) {

  }
  roles: Role[] | undefined;
  get user(){
    return this.authService.user;
  }
  ngOnInit() {
    this.verificationService.checkToken().pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            this.message.error("身份信息已经过期，请重新登录");
            this.router.navigate(["/chat", "account", "sign-in"]);
          }

        } else {
          this.message.error("网络错误")
        }
        throw err;
      })
    ).subscribe({
      next: value => {
        this.fetchRolesOfThisUser();
        console.log("ok")
      }
    })
  }
  fetchRolesOfThisUser(){
    this.call.getRolesByUserId(this.user?.id!).subscribe({
      next: roles =>{
        this.roles = roles;
      }
    })
  }

  logout() {
    this.authService.logout();
    this.ngOnInit();
  }
}
