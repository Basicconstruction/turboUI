import {GPTType} from "./GPTType";

export const UserRole = "user";
export const AssistantRole = "assistant";
export const SystemRole = "system";
export interface FileInChat{
  fileName: string;
  type?: string;
  fileSize?: number;
  content?: string;//bs64
}
export class ChatModel {

  // 查找id删除某条对话
  constructor(public role: string = 'user', public content: string = '',public fileList?:FileInChat[],public dataId?: number,public type: GPTType = GPTType.ChatStream,public finish: boolean = true) {
    if(dataId==null){
      this.dataId = Date.now();
    }
  }
}
export interface ChatInterface{
  role: string;
  content?: string
  fileList?: FileInChat[];
  dataId: number;
  type: GPTType;
  finish: boolean;
}
