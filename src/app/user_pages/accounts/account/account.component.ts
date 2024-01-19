import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  imports: [
    RouterOutlet,
    TranslateModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    RouterLink
  ],
  standalone: true
})
export class AccountComponent {

}
