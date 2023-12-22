import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SystemPromptItem} from "../../../models";
import {FormControl, FormGroup, NonNullableFormBuilder, Validators} from "@angular/forms";
import {SystemPromptService} from "../../../share-datas/system-prompt.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-look-update-prompt',
  templateUrl: './look-update-prompt.component.html',
  styleUrl: './look-update-prompt.component.css'
})
export class LookUpdatePromptComponent {
  constructor(private fb: NonNullableFormBuilder,
              private systemPromptService: SystemPromptService,
              private notification: NzNotificationService) {

  }
  @Output()
  close = new EventEmitter<boolean>();
  _prompt: SystemPromptItem | undefined;
  @Input()
  set prompt(prompt: SystemPromptItem | undefined){
    if(prompt===undefined){
      this.close.emit(true);
    }
    this._prompt = prompt;
    this.validateForm.setValue({
      title: prompt?.title!,
      content: prompt?.content!
    });
  }
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
      this._prompt!.title = value.title;
      this._prompt!.content = value.content!;
      this.notification.success("验证成功","");
      this.systemPromptService.addOrPutPrompts({
        id: this._prompt?.id,
        title: value.title,
        content: value.content!
      }).then(()=>{
        this.close.emit(true);
      })
      this.validateForm.reset();
    }
  }
}
