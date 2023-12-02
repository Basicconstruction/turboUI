import {ShowType} from "./GPTType";

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

  // 查找id删除某条对话
  constructor(public role: string = 'user', public content: string = '', public fileList?:FileInChat[], public dataId?: number, public showType: ShowType = ShowType.staticChat, public finish: boolean = true) {
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
  showType: ShowType;
  finish: boolean;
}
