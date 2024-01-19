import {Component, EventEmitter, Output} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NzMessageService} from "ng-zorro-antd/message";
import {AccountCallService} from "../../../../admin_anythings/services";

@Component({
  selector: 'app-new-role',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './new-role.component.html',
  styleUrl: './new-role.component.css'
})
export class NewRoleComponent {
  validateForm: FormGroup<{
    name: FormControl<string>;
  }> = this.fb.group({
    name: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(15)]],
  });
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: AccountCallService) {

  }
  @Output()
  close = new EventEmitter<boolean>();
  submitForm() {
    if (this.validateForm.valid) {
      this.call.addRole(this.validateForm.value.name!).subscribe({
        next: () =>{
          this.message.success("添加成功");
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
