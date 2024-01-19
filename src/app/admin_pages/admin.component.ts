import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent} from "ng-zorro-antd/menu";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [
    NzIconDirective,
    NzLayoutComponent,
    NzHeaderComponent,
    NzContentComponent,
    NzSubMenuComponent,
    NzMenuItemComponent,
    NzMenuDirective,
    NzSiderComponent,
    RouterLink,
    RouterOutlet
  ]
})
export class AdminComponent {
  isCollapsed = false;
}
