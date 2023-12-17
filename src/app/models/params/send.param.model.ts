import {Message, VisionMessage} from "../message.model";
import {NzUploadFile} from "ng-zorro-antd/upload";

export class ChatPacket{
  constructor(public messages: Message[]) {
  }
}
export class ChatVisionPacket{
  constructor(public messages: VisionMessage[]) {
  }
}
export class ImagePacket{
  constructor(public prompt: string) {
  }
}
export class SpeechPacket{
  constructor(public text: string,public fileList?: NzUploadFile[]){

  }
}
export class TranscriptionPacket{
  constructor(public transcription:boolean ,public fileList: NzUploadFile[],public prompt?: string){

  }
}
