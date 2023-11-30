import {Message} from "./message.model";
import {NzUploadFile} from "ng-zorro-antd/upload";

export class ChatPacket{
  constructor(public message: Message[]) {
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
