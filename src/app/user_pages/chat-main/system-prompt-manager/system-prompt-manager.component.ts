import {Component, Input} from '@angular/core';
import {ChatContext} from "../../../user_anything/services";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {ChatModel} from "../../../user_anything/models";

@Component({
  selector: 'app-system-prompt-manager',
  templateUrl: './system-prompt-manager.component.html',
  styleUrl: './system-prompt-manager.component.css',
  imports: [
    NzFormModule,
    NzButtonModule,
    NzSwitchModule,
    FormsModule,
    NzSkeletonModule,
    NgIf,
    NgForOf,
    TranslateModule
  ],
  standalone: true
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
