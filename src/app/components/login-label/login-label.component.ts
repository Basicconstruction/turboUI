import {Component} from '@angular/core';
import {AuthService} from "../../auth";
import {SizeReportService} from "../../services";
import {SidebarService} from "../../services";
import {Router} from "@angular/router";
import {NzButtonModule} from "ng-zorro-antd/button";

@Component({
  selector: 'app-login-label',
  templateUrl: './login-label.component.html',
  styleUrl: './login-label.component.css',
  imports: [
    NzButtonModule,
  ],
  standalone: true
})
export class LoginLabelComponent {
  constructor(private authService: AuthService,
              private sizeReportService: SizeReportService,
              public sidebarService: SidebarService,
              private router: Router) {
  }
  get isLogin():boolean{
    return this.authService.isLogin;
  }

  openRightsPage() {
    this.router.navigate(['/chat','login']).then(
      ()=>{
        if(this.sizeReportService.miniPhoneView()){
          this.sidebarService.close();
        }
      }
    );
  }
}
