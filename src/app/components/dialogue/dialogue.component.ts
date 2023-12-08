import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {ChatModel, ShowType, TaskType, UserTask} from "../../models";
import {UserRole} from "../../models/chat.model";
import {ConfigurationService} from "../../share-datas";
import {configurationServiceToken} from '../../share-datas/datas.module';


@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css'
})
export class DialogueComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  constructor(@Inject(configurationServiceToken) private configurationService: ConfigurationService) {
  }
  getFontSize() {
    return `font-size: ${this.configurationService.configuration?.displayConfiguration.fontSize}px !important;`
  }
  @Input()
  set content(value: string | undefined) {
    this._content = value;
  }
  @Input()
  active: boolean = false;

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  @Output()
  userTask = new EventEmitter<UserTask>();

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
    if(role===undefined) return "assets/";
    if(role===UserRole){
      return 'assets/programmer.png';
    }
    if(type===undefined) return 'assets/chat-gpt.png';
    switch (type){
      case ShowType.promiseVision:
      case ShowType.staticVision:
        return "assets/vision.svg";
      case ShowType.staticImage:
      case ShowType.promiseImage:
        return "assets/dall.svg";
      case ShowType.staticSpeech:
      case ShowType.promiseSpeech:
        return "assets/tts.svg";
      case ShowType.staticTranscription:
      case ShowType.promiseTranscription:
        return "assets/stt.png";

    }
    return "assets/chat-gpt.png";
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
