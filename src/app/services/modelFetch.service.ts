import {Injectable} from "@angular/core";
import {OpenaiService} from "../fetch";
import {ChatPacket, ChatVisionPacket, ImagePacket, RequestType, SpeechPacket, TranscriptionPacket} from "../models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ModelFetchService{
  constructor(private openaiService: OpenaiService) {
  }
  public getFetchResponse(type: RequestType,
                          param:  ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket){
    console.log("type");
    console.log(type)
    console.log(param)
    let subject: Observable<string>;
    switch (type) {
      case RequestType.Chat:
        subject = this.openaiService.fetchChat(param as ChatPacket);
        break;
      case RequestType.Image:
        subject = this.openaiService.fetchImage(param as ImagePacket);
        break;
      case RequestType.Speech:
        subject = this.openaiService.fetchTTS(param as SpeechPacket);
        break;
      case RequestType.Transcription:
        subject = this.openaiService.fetchSTT(param as TranscriptionPacket);
        break;
      case RequestType.ChatVision:
        subject = this.openaiService.fetchChatVision(param as ChatVisionPacket);
        break;
    }
    return subject;
  }
}
