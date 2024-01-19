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
import {Model} from "../../../../admin_anythings/models/keys";
import {KeyCallService} from "../../../../admin_anythings/services";

@Component({
  selector: 'app-edit-model',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-model.component.html',
  styleUrl: './edit-model.component.css'
})
export class EditModelComponent {
  validateForm: FormGroup<{
    modelId: FormControl<number>;
    name: FormControl<string>;
  }> = this.fb.group({
    modelId: [0, [Validators.required]],
    name: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(30)]],
  });
  constructor(
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private call: KeyCallService) {
  }
  _model: Model | undefined;
  @Input()
  set model(model: Model){
    this._model = model;
    this.validateForm.setValue({
      modelId: this._model!.modelId!,
      name: this._model!.name!
    });
  }
  @Output()
  close = new EventEmitter<boolean>();
  submitForm() {
    if (this.validateForm.valid) {
      this.call.updateModel(
        {
          modelId: this._model!.modelId,
          name: this.validateForm.value.name!
        })
        .subscribe({
          next: () =>{
            this.message.success("更改模型成功");
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
