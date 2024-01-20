import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountCallService} from "../../../../admin_anythings/services";
import {Role} from "../../../../share/models/accounts";
import {admin_routes} from "../../../../admin_anythings/routes";

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzTooltipDirective
  ],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.css'
})
export class AccountCreateComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: AccountCallService,
    private router: Router,
    private route: ActivatedRoute) {
  }
  goBack() {
    this.router.navigate([this.returnUrl]);
  }
  returnUrl: string | undefined;
  ngOnInit(){
    this.fetchRoles();
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
    });
  }
  validateForm: FormGroup<{
    accountId: FormControl<number>,
    username: FormControl<string>,
    password: FormControl<string>,
    email:FormControl<string>,
  }> = this.fb.group({
    accountId: [0, [Validators.required]],
    username: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(15)]],
    password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(15)]],
    email: ['', [Validators.required,Validators.email]],
  });
  roles: Role[] = [];
  allRoles: Role[] | undefined;
  actionTip(roleId: number){
    return this.roles.find(r=>r.roleId===roleId)!==undefined?'移除':'添加';
  }
  active(roleId: number){
    return this.roles.find(r=>r.roleId===roleId)!==undefined;
  }
  fetchRoles(refresh: boolean = false){
    this.call.getRolesWithUserId().subscribe({
      next: roles=>{
        this.allRoles = roles;
        if(refresh){
          this.message.success("刷新成功");
        }
      },
      error:() => {
        this.message.error("获取账户信息失败")
      }
    })
  }
  submitForm() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.call.addAccount(
        {
          accountId: value.accountId!,
          username: value.username!,
          password: value.password!,
          email: value.email!,
          userRoles: this.roles
        })
        .subscribe({
          next: () =>{
            this.message.success('创建账户成功');
            this.router.navigate(admin_routes.management);
          },
          error: (err: any) => {
            this.message.error(err.error);
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  action(role: Role) {
    if(this.active(role.roleId)){
      this.roles = this.roles.filter(r=>r.roleId!=role.roleId);
    }else{
      this.roles.push(role);
    }
  }


}
