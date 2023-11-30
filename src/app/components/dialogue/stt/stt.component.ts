import {Component, Input} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";

@Component({
  selector: 'app-stt',
  templateUrl: './stt.component.html',
  styleUrl: './stt.component.css'
})
export class SttComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  public imageList: ImageList | undefined;
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

  loading() {
    return this.chatModel?.finish === false;
  }
}
