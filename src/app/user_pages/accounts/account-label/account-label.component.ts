import {Component, Inject} from '@angular/core';
import {AuthService} from "../../../share/auth_module";
import {SizeReportService} from "../../../user_anything/services";
import {SidebarService} from "../../../user_anything/services";
import {Router, RouterLink} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {MessageService} from "../../../share/auth_module";
import {user_routes} from "../../../user_anything/routes";
import {sideBarToken, sizeReportToken} from "../../../user_anything/injection_tokens";

@Component({
  selector: 'app-account-label',
  templateUrl: './account-label.component.html',
  styleUrl: './account-label.component.css',
  imports: [
    NzButtonModule,
    TranslateModule,
    RouterLink,
  ],
  providers: [
  ],
  standalone: true
})
export class AccountLabelComponent {
  constructor(private authService: AuthService,
              @Inject(sizeReportToken) private sizeReportService: SizeReportService,
              @Inject(sideBarToken) public sidebarService: SidebarService,
              private router: Router) {
  }
  get isLogin():boolean{
    return this.authService.isLogin;
  }

  openSignIn() {
    this.router.navigate(user_routes.sign_in).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }

  openAccount() {
    if(this.sizeReportService.miniPhoneView()){
      this.sidebarService.close();
    }
    this.router.navigate(user_routes.account_info).then(
      ()=>{
      }
    );
  }
}
