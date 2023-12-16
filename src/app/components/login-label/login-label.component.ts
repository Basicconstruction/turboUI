import {Component, Inject} from '@angular/core';
import {AuthService} from "../../auth";
import {SizeReportService} from "../../services/sizeReport.service";
import {SidebarService} from "../../services/sidebar.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-label',
  templateUrl: './login-label.component.html',
  styleUrl: './login-label.component.css'
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
