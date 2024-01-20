import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzSkeletonComponent} from "ng-zorro-antd/skeleton";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NzPopconfirmDirective} from "ng-zorro-antd/popconfirm";
import {Account} from "../../../admin_anythings/models/accounts";
import {AccountCallService} from "../../../admin_anythings/services";
import {admin_routes} from "../../../admin_anythings/routes";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
  imports: [
    NzSkeletonComponent,
    RouterLink,
    NzPopconfirmDirective
  ],
  standalone: true
})
export class AccountManagementComponent implements OnInit{
    accounts: Account[] | undefined;
    constructor(private call: AccountCallService, private message: NzMessageService,
                private route: ActivatedRoute) {

    }
    roleId:number | undefined;
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const roleId = params['roleId'];
        if(roleId!==this.roleId){
          this.roleId = roleId;
          this.fetchAccounts(false,this.roleId);
        }else{
          this.fetchAccounts(false);
        }
      });
    }
    refresh(){
      this.fetchAccounts(true,this.roleId)
    }
    delete(id: number){
      this.call.deleteAccountById(id)
        .subscribe({
          next: msg=>{
            this.message.success("删除成功")
            this.refresh();
          },
          error: err=>{
            this.message.error(err.error)
          }
        })
    }
    fetchAccounts(refresh: boolean = false,roleId: number | undefined=undefined){
      this.call.getAccountsWithRole(roleId).subscribe({
        next: accounts=>{
          this.accounts = accounts;
          if(refresh){
            this.message.success("刷新成功");
          }
        },
        error: err => {
          this.message.error("获取账户信息失败")
        }
      });
    }

  protected readonly admin_routes = admin_routes;
}
