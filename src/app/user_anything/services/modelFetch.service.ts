import {Injectable} from "@angular/core";
import {OpenaiService} from "../fetch_services";
import {Observable} from "rxjs";
import {TurboService} from "../fetch_services/turbo.service";
import {AuthService} from "../../share/auth_module";
import {ChatPacket, ChatVisionPacket, ImagePacket, SpeechPacket, TranscriptionPacket} from "../models";
import {RequestType} from "../models/enumerates";

@Injectable()
export class ModelFetchService{
  constructor(private openaiService: OpenaiService,private turboService: TurboService,
              private authService: AuthService) {
  }
  public getFetchResponse(type: RequestType,
                          param:  ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket,
                          model?: string){
    let subject: Observable<string>;
    let service: OpenaiService | TurboService | undefined;
    if(this.authService.isLogin){
      service = this.turboService;
    }else{
      service = this.openaiService;
    }
    switch (type) {
      case RequestType.Chat:
        subject = service.fetchChat(param as ChatPacket,model);
        break;
      case RequestType.Image:
        subject = service.fetchImage(param as ImagePacket,model);
        break;
      case RequestType.Speech:
        subject = service.fetchTTS(param as SpeechPacket,model);
        break;
      case RequestType.Transcription:
        subject = service.fetchSTT(param as TranscriptionPacket,model);
        break;
      case RequestType.ChatVision:
        subject = service.fetchChatVision(param as ChatVisionPacket,model);
        break;
    }
    return subject;
  }
}
