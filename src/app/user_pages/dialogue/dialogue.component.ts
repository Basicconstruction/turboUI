import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {ConfigurationService} from "../../user_anything/data-services";
import {SizeReportService} from "../../user_anything/services";
import {SidebarService} from "../../user_anything/services";
import {ClipboardService} from "ngx-clipboard";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NgOptimizedImage} from "@angular/common";
import {StaticRequestComponent} from "./static-request/static-request.component";
import {StaticImageComponent} from "./static-image/static-image.component";
import {StaticTtsComponent} from "./static-tts/static-tts.component";
import {ChatComponent} from "./chat/chat.component";
import {ImageComponent} from "./image/image.component";
import {TtsComponent} from "./tts/tts.component";
import {SttComponent} from "./stt/stt.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {sideBarToken, sizeReportToken} from "../../user_anything/injection_tokens";
import {TranslateModule} from "@ngx-translate/core";
import {ChatModel,  SystemRole, UserRole} from "../../user_anything/models";
import {TaskType, UserTask} from "../../user_anything/models/operations";
import {ShowType} from "../../user_anything/models/enumerates";
@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css',
  imports: [
    NzImageModule,
    NzToolTipModule,
    NzIconModule,
    NgOptimizedImage,
    StaticRequestComponent,
    StaticImageComponent,
    StaticTtsComponent,
    ChatComponent,
    ImageComponent,
    TtsComponent,
    SttComponent,
    NzButtonModule,
    NzSkeletonModule,
    TranslateModule,
  ],
  standalone: true
})
export class DialogueComponent {
  private _chatModel: ChatModel | undefined;
  constructor(private configurationService: ConfigurationService,
              @Inject(sizeReportToken) private sizeReportService: SizeReportService,
              @Inject(sideBarToken) private sideBarService: SidebarService,
              private clipboard: ClipboardService,
              private notification: NzNotificationService
              ) {
  }
  getFontSize() {
    return `font-size: ${this.configurationService.configuration?.displayConfiguration.fontSize}px !important;`
  }
  @Input()
  set content(value: string | undefined) {

  }
  @Input()
  active: boolean = false;

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  @Output()
  userTask = new EventEmitter<UserTask>();

  isMiniView(){
    return this.sizeReportService.miniPhoneView();
  }
  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }

  protected readonly UserRole = UserRole;

  get type(): ShowType | undefined {
    return this._chatModel?.showType === undefined ? undefined : this._chatModel?.showType;
  }


  getDisplayType(type: ShowType | undefined): DisplayType {
    if (type === undefined) return DisplayType.default;
    switch (type) {
      case ShowType.staticChatRequest:
      case ShowType.staticVisionRequest:
      case ShowType.staticImageRequest:
      case ShowType.staticSpeechRequest:
      case ShowType.staticTranscriptionRequest:
      case ShowType.staticChat:
      case ShowType.staticVision:
      case ShowType.staticTranscription:
        return DisplayType.staticRequestOrResult;

      case ShowType.promiseChat:
      case ShowType.promiseVision:
        return DisplayType.dynamicChatResult;
      case ShowType.promiseSpeech:
        return DisplayType.dynamicSpeechResult;
      case ShowType.promiseImage:
        return DisplayType.dynamicImageResult;
      case ShowType.promiseTranscription:
        return DisplayType.dynamicTranscriptionResult;

      case ShowType.staticImage:
        return DisplayType.staticImageResult;
      case ShowType.staticSpeech:
        return DisplayType.staticSpeechResult;
      default:
        return DisplayType.default;

    }
  }

  protected readonly DisplayType = DisplayType;

  getIcon(role: string | undefined, type: ShowType | undefined) {
    if(role===undefined) return "assets/svgs";
    if(role===UserRole){
      return 'assets/svgs/programmer.png';
    }else if(role===SystemRole){
      return 'assets/svgs/system.svg';
    }
    if(type===undefined) return 'assets/svgs/chat-gpt.png';
    switch (type){
      case ShowType.promiseVision:
      case ShowType.staticVision:
        return "assets/svgs/vision.svg";
      case ShowType.staticImage:
      case ShowType.promiseImage:
        return "assets/svgs/dall.svg";
      case ShowType.staticSpeech:
      case ShowType.promiseSpeech:
        return "assets/svgs/tts.svg";
      case ShowType.staticTranscription:
      case ShowType.promiseTranscription:
        return "assets/svgs/stt.png";

    }
    return "assets/svgs/chat-gpt.png";
  }
  isHover: boolean = false;

  onMouseEnter() {
    this.isHover = true;
  }

  onMouseLeave() {
    this.isHover = false;
  }

  triggerEdit() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.edit, this.chatModel?.dataId!));
  }

  triggerStartAsContext() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.asContext, this.chatModel?.dataId!));
  }

  triggerDelete() {
    if(!this.chatModel) return;
    this.userTask.emit(new UserTask(TaskType.delete, this.chatModel?.dataId!));
  }

  getHeadName(chatModel: ChatModel | undefined) {
    if(chatModel===undefined){
      return "error";
    }
    if(chatModel.role===UserRole){
      return "You";
    }
    if(chatModel.role===SystemRole){
      return "System";
    }
    const index = chatModel.showType.valueOf()%5;
    switch (index){
      case 0:
        return "ChatGPT";
      case 1:
        return "Vision";
      case 2:
        return "Dall";
      case 3:
        return "Speech";
      case 4:
        return "Whisper";
      default:
        return "ChatGPT";
    }
  }

  getWidth() {
    let additional = this.sideBarService.isSideBarClosed? 0 : -260;
    if(this.sizeReportService.width! <=606){
      return "width: "+this.sizeReportService.width!+"px;";
    }
    else if(this.sizeReportService.width!<800){
      return "width: "+(this.sizeReportService.width!+additional)+"px;";
    }else{
      if(this.sizeReportService.width!+additional>=800){
        // 减去sideBar 之后剩余宽度大于800，使用800
        return "width: "+800+"px;";
      }
      // 减去sideBar 之后剩余宽度小于800，使用实际的宽度
      return "width: "+(this.sizeReportService.width!+additional)+"px;";
    }
  }

  copyAllContent() {
    this.clipboard.copy(this.chatModel?.content!);
    this.notification.success("复制内容成功","");
  }
  @Output()
  reGenerateSignal = new EventEmitter<number>();
  reRequest() {
    if(this.chatModel?.finish){
      this.reGenerateSignal.emit(this.chatModel.dataId);
    }else{
      this.notification.error("当前请求还没有结束","");
    }
  }
}

enum DisplayType {
  staticRequestOrResult,
  staticImageResult,
  staticSpeechResult,

  dynamicChatResult,
  dynamicImageResult,
  dynamicSpeechResult,
  dynamicTranscriptionResult,
  default,
}
