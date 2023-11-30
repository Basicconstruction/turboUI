import {Message} from "./message.model";

export class ChatPacket{
  constructor(public message: Message[]) {
  }
}
export class ImagePacket{
  constructor(public prompt: string) {
  }
}
export class SpeechPacket{

}
export class TranscriptionPacket{

}
