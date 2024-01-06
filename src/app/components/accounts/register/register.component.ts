import { Component } from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder, ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    TranslateModule,
    RouterLink,
    ReactiveFormsModule,
    NzCardComponent,
    NzFormDirective,
    NzFormLabelComponent,
    NzColDirective,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputDirective,
    NzButtonComponent
  ],
  standalone: true
})
export class RegisterComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
  }> = this.fb.group({
    userName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]],
    confirm: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]]
  });

  submitForm(): void {
    if (this.validateForm.valid&&this.validateForm.value.confirm===this.validateForm.value.password) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }



  constructor(private fb: NonNullableFormBuilder) {
    // @ts-ignore
    this.validateForm.setValidators(this.passwordMatchValidator);
  }
  private passwordMatchValidator(group: FormGroup) {
    // @ts-ignore
    const password = group.get('password').value;
    // @ts-ignore
    const confirm = group.get('confirm').value;

    return password === confirm ? null : { passwordMatch: true };
  }
}

