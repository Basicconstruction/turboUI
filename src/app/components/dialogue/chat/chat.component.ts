import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  constructor(private notification: NzNotificationService) {
  }

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

}
