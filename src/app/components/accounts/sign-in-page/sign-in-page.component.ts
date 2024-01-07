import {Component, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from "../../../auth";
import {Router, RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzFormControlComponent, NzFormDirective} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";
import {NzMessageService} from "ng-zorro-antd/message";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {VerificationService} from "../../../auth/vertification.service";
import {Element} from "@angular/compiler";

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
    NzCheckboxComponent,
    FormsModule
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
              private fb: NonNullableFormBuilder,
              private verificationService: VerificationService,
              private message: NzMessageService) {

  }
  @ViewChild("vCode")
  vCode: ElementRef |undefined;
  submitForm(): void {
    if (this.validateForm.valid) {
      if(this.code?.toLowerCase()!==this.vCode?.nativeElement.value.toLowerCase()){
        this.message.error("验证码错误");
        this.generateVerificationCode();
        return;
      }
      let username = this.validateForm.value.userName;
      let password = this.validateForm.value.password!;
      this.authService.login(username!,password!)
        .subscribe({
          next: response => {
            console.log(response)
            this.authService.restore({name: username!, id: response.id,password: password!}, response.token);
            this.router.navigate(["/chat","account","account-info"])
            }
        });

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  ngOnInit(): void {
    this.generateVerificationCode();
  }
  code: string | undefined;
  codeUrl: string | undefined;
  generateVerificationCode() {
    this.verificationService.generateVerificationCode()
      .subscribe(
      {
        next: (value:any) => {
          this.code = value.code;
          this.codeUrl = 'data:image/jpeg;base64,' + value.img;
        }
      }
    );
  }

}
