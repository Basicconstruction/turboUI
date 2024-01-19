import { Component } from '@angular/core';
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {RouterLink} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalComponent, NzModalContentDirective, NzModalModule} from "ng-zorro-antd/modal";
import {NewRoleComponent} from "./new-role/new-role.component";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {EditRoleComponent} from "./edit-role/edit-role.component";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {AccountCallService} from "../../../admin_anythings/services";
import {Role} from "../../../share/models/accounts";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    NzSkeletonComponent,
    RouterLink,
    NzModalComponent,
    NzModalContentDirective,
    NewRoleComponent,
    NzModalModule,
    NzPopconfirmDirective,
    EditRoleComponent,
    NzTooltipDirective
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  roles: Role[] | undefined;
  constructor(private message: NzMessageService, private call: AccountCallService) {
  }
  newRoleVisible : boolean = false;
  refresh() {
    this.fetchRoles(true);
  }
  ngOnInit(){
    this.fetchRoles();
  }
  delete(roleId: number) {
    this.call.deleteRoleById(roleId)
      .subscribe({
        next: msg=>{
          this.message.success("删除成功");
          this.fetchRoles(true);
        },
        error: (err:any)=>{
          this.message.error("删除错误");
        }
      })
  }
  fetchRoles(refresh: boolean = false){
    this.call.getRolesWithUserId().subscribe({
      next: roles=>{
        this.roles = roles;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error:(err: any) => {
        this.message.error("获取账户信息失败")
      }
    })
  }

  tackleClose($event: boolean) {
    if($event){
      this.newRoleVisible = false;
      this.fetchRoles(true);
    }
  }
  editRoleVisible: boolean = false;
  editRole: Role | undefined;
  tackleEditClose($event: boolean) {
    if($event){
      this.editRoleVisible = false;
      this.fetchRoles(true);
    }
  }

  editARole(role: Role) {
    this.editRole = role;
    this.editRoleVisible = true;
  }
}
