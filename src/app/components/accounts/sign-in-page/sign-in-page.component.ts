import {Component, signal} from '@angular/core';
import {AuthService} from "../../../auth";
import {Router, RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {MessageService} from "../../../auth/message.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [
    NzCardModule,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    TranslateModule
  ],
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent {
  message: string = "登录成功，正在返回";
  constructor(private authService: AuthService, private router: Router,
              private messageService: MessageService) {

  }
  ngOnInit(): void {

  }
  login(){
    this.authService.login()
    this.messageService.sendMessageToServer("hello world");
    if(this.authService.isLogin){
      this.router.navigate(['/chat','account','account-info'])
    }
  }

}
