import {Component} from '@angular/core';
import {AuthService} from "../../../share/auth_module";
import {SizeReportService} from "../../../user_anything/services";
import {SidebarService} from "../../../user_anything/services";
import {Router, RouterLink} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";
import {MessageService} from "../../../share/auth_module";

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
              private sizeReportService: SizeReportService,
              public sidebarService: SidebarService,
              private router: Router,
              private messageService: MessageService) {
  }
  get isLogin():boolean{
    return this.authService.isLogin;
  }

  openSignIn() {
    this.router.navigate(['/chat','account','sign-in']).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }

  openAccount() {
    this.router.navigate(['/chat','account','account-info']).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }
}
