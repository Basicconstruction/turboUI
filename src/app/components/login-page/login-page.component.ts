import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../auth";
import {Router, RouterLink} from "@angular/router";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NgForOf, NgStyle} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  standalone: true,
  imports: [
    NzFormModule,
    NzModalModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzPopoverModule,
    NzInputNumberModule,
    NzSliderModule,
    FormsModule,
    NzInputModule,
    RouterLink,
    NgStyle,
    NzSelectModule,
    NgForOf
  ],
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
