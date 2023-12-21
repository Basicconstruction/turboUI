import {Component, EventEmitter, Output} from '@angular/core';
import {SystemPromptService} from "../../../share-datas/system-prompt.service";
import {FormControl, FormGroup, NonNullableFormBuilder, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {valueReferenceToExpression} from "@angular/compiler-cli/src/ngtsc/annotations/common";

@Component({
  selector: 'app-create-prompt',
  templateUrl: './create-prompt.component.html',
  styleUrl: './create-prompt.component.css'
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
