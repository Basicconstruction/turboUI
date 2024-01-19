import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {AccountCallService} from "../../../../admin_anythings/services";
import {Role} from "../../../../share/models/accounts";

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.css'
})
export class EditRoleComponent {
  validateForm: FormGroup<{
    roleId: FormControl<number>;
    name: FormControl<string>;
  }> = this.fb.group({
    roleId: [0, [Validators.required]],
    name: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(15)]],
  });
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: AccountCallService) {
  }
  _role: Role | undefined;
  @Input()
  set role(role: Role){
    this._role = role;
    this.validateForm.setValue({
      roleId: this._role!.roleId,
      name: this._role!.name
    });
  }
  @Output()
  close = new EventEmitter<boolean>();
  submitForm() {
    if (this.validateForm.valid) {
      this.call.updateRole(
        {
          roleId: this._role!.roleId,
          name: this.validateForm.value.name!
        })
        .subscribe({
        next: () =>{
          this.message.success("更改身份成功");
          this.close.next(true);
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
}
