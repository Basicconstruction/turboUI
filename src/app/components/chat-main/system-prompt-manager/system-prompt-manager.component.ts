import {Component, Input} from '@angular/core';
import {ChatContext} from "../../../services";
import {ChatModel} from "../../../models";

@Component({
  selector: 'app-system-prompt-manager',
  templateUrl: './system-prompt-manager.component.html',
  styleUrl: './system-prompt-manager.component.css'
})
export class SystemPromptManagerComponent{
  @Input()
  chatContext: ChatContext | undefined;
  @Input()
  chatModels: ChatModel[] | undefined;
  getItem(id: number):ChatModel | undefined{
    return this.chatModels?.find(m=>m.dataId===id);
  }

  putAll() {
    for(let item of this.chatContext?.systems!){
      item.in = true;
    }
  }

  removeAll() {
    for(let item of this.chatContext?.systems!){
      item.in = false;
    }
  }
}
