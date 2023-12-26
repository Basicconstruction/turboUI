import {Component, EventEmitter, Output} from '@angular/core';
import {SystemPromptService} from "../../../share-datas/system-prompt.service";
import {FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-create-prompt',
  templateUrl: './create-prompt.component.html',
  styleUrl: './create-prompt.component.css',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    TranslateModule
  ],
  standalone: true
})
export class CreatePromptComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private systemPromptService: SystemPromptService,
    private notification: NzNotificationService) {
  }
  @Output()
  close = new EventEmitter<boolean>();
  validateForm: FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }> = this.fb.group({
    title: ['',[Validators.required,Validators.minLength(1)]],
    content: ['',[Validators.required, Validators.minLength(2)]]
  });
  submitForm(){
    if(this.validateForm.valid){
      let value = this.validateForm.value;
      this.notification.success("验证成功","");
      this.systemPromptService.addOrPutPrompts({
        id: 0,
        title: value.title,
        content: value.content!
      }).then(()=>{
        this.systemPromptService.reLoad();
        this.close.emit(true);
      })
      this.validateForm.reset();
    }
  }
}
