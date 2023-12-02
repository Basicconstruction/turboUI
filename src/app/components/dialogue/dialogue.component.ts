import {Component, Input} from '@angular/core';
import {ChatModel, ShowType} from "../../models";
import {UserRole} from "../../models/chat.model";


@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css'
})
export class DialogueComponent {
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
