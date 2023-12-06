import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ConfigurationService} from "../../../share-datas";
import {SegmentsService} from "../../../services";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  // separatedSegments: { isCode: boolean; content: string; }[] | undefined;
  constructor(private notification: NzNotificationService,
              private configurationService: ConfigurationService,
              private segmentService: SegmentsService) {
  }
  getFontSize() {
    return `font-size: ${this.configurationService.configuration?.displayConfiguration.fontSize}px !important;`
  }

  @Input()
  set content(value: string | undefined) {
    this._content = value;
    // this.segmentsChat();

  }

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
    // this.segmentsChat();
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }

  // segmentsChat(){
  //   this.separatedSegments = this.segmentService.segmentsChat(this.chatModel);
  // }
  //
  // copyCode(content: string | undefined) {
  //   if(!content) return;
  //   navigator.clipboard.writeText(content);
  //   this.notification.create(
  //     'success',
  //     '复制成功','',{nzClass: 'rounded-5'}
  //   );
  // }
}
