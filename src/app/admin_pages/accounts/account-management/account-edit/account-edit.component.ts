import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountCallService} from "../../../../admin_anythings/services";
import {Role} from "../../../../share/models/accounts";

@Component({
  selector: 'app-account-edit',
  standalone: true,
    imports: [
        FormsModule,
        NzTooltipDirective,
        ReactiveFormsModule
    ],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css'
})
export class AccountEditComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: AccountCallService,
    private router: Router,
    private route: ActivatedRoute) {
    // console.log(this.route.snapshot)
    const accountId = parseInt(this.route.snapshot.params['accountId']);
    this.call.getAccountById(accountId)
      .subscribe({
        next: account=>{
          this.validateForm.setValue({
            accountId: account.accountId,
            username: account.username,
            password: account.password,
            email: account.email===undefined?'':account.email,
          });
          this.roles.length = 0;
          if(account.userRoles===undefined){
            return;
          }
          for(let role of account.userRoles!){
            this.roles.push(role);
          }
        }
      })
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
      error:(err: any) => {
        this.message.error("获取账户信息失败")
      }
    })
  }
  submitForm() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.call.updateAccount(
        {
          accountId: value.accountId!,
          username: value.username!,
          password: value.password!,
          email: value.email!,
          userRoles: this.roles
        })
        .subscribe({
          next: (msg:any) =>{
            this.message.success('更改账户成功');
            this.router.navigate(['/accounts','account-management']);
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
