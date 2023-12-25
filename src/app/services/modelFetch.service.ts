import {Injectable} from "@angular/core";
import {OpenaiService} from "../fetch";
import {ChatPacket, ChatVisionPacket, ImagePacket, RequestType, SpeechPacket, TranscriptionPacket} from "../models";
import {Observable} from "rxjs";

@Injectable()
export class ModelFetchService{
  constructor(private openaiService: OpenaiService) {
  }
  public getFetchResponse(type: RequestType,
                          param:  ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket,
                          model?: string){
    let subject: Observable<string>;
    switch (type) {
      case RequestType.Chat:
        subject = this.openaiService.fetchChat(param as ChatPacket,model);
        break;
      case RequestType.Image:
        subject = this.openaiService.fetchImage(param as ImagePacket,model);
        break;
      case RequestType.Speech:
        subject = this.openaiService.fetchTTS(param as SpeechPacket,model);
        break;
      case RequestType.Transcription:
        subject = this.openaiService.fetchSTT(param as TranscriptionPacket,model);
        break;
      case RequestType.ChatVision:
        subject = this.openaiService.fetchChatVision(param as ChatVisionPacket,model);
        break;
    }
    return subject;
  }
}
