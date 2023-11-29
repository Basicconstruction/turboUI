import {GPTType} from "./GPTType";

export interface ChatHistory{
  title: string,
  dataId: number;
  chatList: Chat[];
}
export interface Chat{
  dataId: number;
  role: string;
  content: string;
  type?: GPTType;
}

export interface ChatHistoryTitle{
  title: string,
  dataId: number;
}

