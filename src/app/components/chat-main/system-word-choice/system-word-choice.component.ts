import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SystemPromptItem} from "../../../models";
import {SystemPromptService} from "../../../share-datas/system-prompt.service";

@Component({
  selector: 'app-system-word-choice',
  templateUrl: './system-word-choice.component.html',
  styleUrl: './system-word-choice.component.css'
})
export class SystemWordChoiceComponent{
  @Output()
  chooseSystemPrompt = new EventEmitter<SystemPromptItem | undefined>();
  systemPrompts: SystemPromptItem[] | undefined;
  constructor(private systemInfoService: SystemPromptService) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
  }
  @Output()
  close = new EventEmitter<any>();

  release(info?: SystemPromptItem) {
    this.chooseSystemPrompt.emit(info);
    this.close.emit(true);
  }
}
