import {Component, signal} from '@angular/core';
import {AuthService} from "../../../auth";
import {Router, RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {MessageService} from "../../../auth/message.service";
import {TranslateModule} from "@ngx-translate/core";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormControlComponent, NzFormDirective} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";

@Component({
  standalone: true,
  imports: [
    NzCardModule,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    TranslateModule,
    NzColDirective,
    ReactiveFormsModule,
    NzRowDirective,
    NzFormDirective,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    NzCheckboxComponent
  ],
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required,Validators.minLength(6), Validators.maxLength(20)]],
    remember: [true]
  });
  constructor(private authService: AuthService, private router: Router,
              private messageService: MessageService,
              private fb: NonNullableFormBuilder) {

  }
  ngOnInit(): void {

  }
  submitForm(): void {
    if (this.validateForm.valid) {
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

}
