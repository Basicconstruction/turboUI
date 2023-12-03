import {Component, Input} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ConfigurationService} from "../../../share-datas";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  separatedSegments: { isCode: boolean; content: string; }[] | undefined;
  constructor(private notification: NzNotificationService,
              private configurationService: ConfigurationService) {
  }
  getFontSize() {
    return `font-size: ${this.configurationService.configuration?.displayConfiguration.fontSize}px !important;`
  }

  @Input()
  set content(value: string | undefined) {
    this._content = value;
    this.segmentsChat();
  }

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
    this.segmentsChat();
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }
  segmentsChat(){
    if (!this.chatModel) return;
    const segments: { content: string, isCode: boolean }[] = [];
    const regex = /```(.*?)```/gs; // 匹配 ``` ``` 代码块
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(this.chatModel.content)) !== null) {
      const codeStartIndex = match.index;
      const codeEndIndex = regex.lastIndex;
      const precedingText = this.chatModel.content.substring(lastIndex, codeStartIndex);
      if (precedingText.trim().length > 0) {
        segments.push({content: precedingText, isCode: false});
      }
      const codeContent = match[1];
      segments.push({content: codeContent, isCode: true});
      lastIndex = codeEndIndex;
    }

    const remainingText = this.chatModel.content.substring(lastIndex);
    if (remainingText.trim().length > 0) {
      segments.push({content: remainingText, isCode: false});
    }

    this.separatedSegments = segments;
  }

  copyCode(content: string) {
    navigator.clipboard.writeText(content);
    this.notification.create(
      'success',
      '复制成功','',{nzClass: 'rounded-5'}
    );
  }
}
