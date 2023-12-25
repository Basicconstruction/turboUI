import {Injectable} from "@angular/core";
import {RequestType, ShowType} from "../models";

@Injectable()
export class ShowTypeService{
  public getRequestType(type: ShowType): RequestType{
    return type % 5;
  }
  public getSendMessageType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChatRequest;
      case RequestType.Image:
        return ShowType.staticImageRequest;
      case RequestType.Speech:
        return ShowType.staticSpeechRequest;
      case RequestType.Transcription:
        return ShowType.staticTranscriptionRequest;
      case RequestType.ChatVision:
        return ShowType.staticVisionRequest;
      default:
        return ShowType.staticChatRequest;
    }
  }
  public getPromiseReceiveType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.promiseChat;
      case RequestType.Image:
        return ShowType.promiseImage;
      case RequestType.Speech:
        return ShowType.promiseSpeech;
      case RequestType.Transcription:
        return ShowType.promiseTranscription;
      case RequestType.ChatVision:
        return ShowType.promiseVision;
      default:
        return ShowType.staticChatRequest;
    }
  }
  public getStaticResponseType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChat;
      case RequestType.Image:
        return ShowType.staticImage;
      case RequestType.Speech:
        return ShowType.staticSpeech;
      case RequestType.Transcription:
        return ShowType.staticTranscription;
      case RequestType.ChatVision:
        return ShowType.staticVision;
      default:
        return ShowType.staticChatRequest;
    }
  }
}
