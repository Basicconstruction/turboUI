import {Component, Inject} from '@angular/core';
import {AuthService} from "../../auth";

@Component({
  selector: 'app-login-label',
  templateUrl: './login-label.component.html',
  styleUrl: './login-label.component.css'
})
export class LoginLabelComponent {
  constructor(private authService: AuthService) {
  }
  get isLogin():boolean{
    return this.authService.isLogin;
  }
}
