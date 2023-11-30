import {Component, Input} from '@angular/core';
import {ChatModel, DallImage, ImageList} from "../../models";
import {UserRole} from "../../models/chat.model";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DomSanitizer} from "@angular/platform-browser";

import {GPTType} from "../../models/GPTType";

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css'
})
export class DialogueComponent {
  constructor(
              private sanitizer: DomSanitizer,) {
  }

  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  @Input()
  set content(value: string | undefined) {
    this._content = value;
  }

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }

  protected readonly UserRole = UserRole;
  get type(): GPTType | undefined{
    return this._chatModel?.type===undefined?undefined: this._chatModel?.type;
  }

  protected readonly GPTType = GPTType;


}
