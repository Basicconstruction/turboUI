import {ShowType} from "./enumerates";


export const UserRole = "user";
export const AssistantRole = "assistant";
export const SystemRole = "system";
export interface FileInChat{
  fileName: string;
  fileType?: string;
  fileSize?: number;
  fileContent?: string;//bs64
}
export class ChatModel {

  public markAsChanged = false;
  constructor(public role: string = 'user',
              public content: string = '',
              public fileList?:FileInChat[],
              public dataId?: number,
              public showType: ShowType = ShowType.staticChat,
              public finish: boolean = true,
              public model?: string) {
    if(dataId==null){
      this.dataId = Date.now() * 1000 + Math.floor(Math.random() * 500) ;
    }
  }
  public reRandom(){
    const id = Math.floor(this.dataId! / 1000) * 1000;
    const random = Math.floor(Math.random()*500);
    this.dataId = id + (random <500 ? 500 : 499+random);
  }

}
export interface ChatInterface{
  role: string;
  content?: string
  fileList?: FileInChat[];
  dataId: number;
  showType: ShowType;
  finish: boolean;
  model?: string;
}
