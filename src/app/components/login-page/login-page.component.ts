import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent{
  message: string = "登录成功，正在返回";
  constructor(private authService: AuthService, private router: Router) {

  }
  ngOnInit(): void {
    // this.authService.login();
    // if (this.authService.isLogin) {
    //   this.router.navigate(['chat']); // 登录成功后跳转到 /chat 页面
    // }else{
    //   this.message = "自动登录失败";
    // }
  }

}
