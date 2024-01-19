import {Component, EventEmitter, Output} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {KeyCallService} from "../../../../admin_anythings/services";

@Component({
  selector: 'app-new-model',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './new-model.component.html',
  styleUrl: './new-model.component.css'
})
export class NewModelComponent {
  validateForm: FormGroup<{
    name: FormControl<string>;
  }> = this.fb.group({
    name: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(30)]],
  });
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: KeyCallService) {

  }
  @Output()
  close = new EventEmitter<boolean>();
  submitForm() {
    if (this.validateForm.valid) {
      this.call.addModel(this.validateForm.value.name!).subscribe({
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
