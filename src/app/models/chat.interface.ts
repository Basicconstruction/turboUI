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
export interface DallImage{
  revised_prompt:string,
  url:string,
  b64_json:string
}
export interface ImageList{
  dataId: number;
  images: DallImage[]
}
export interface ChatHistoryTitle{
  title: string,
  dataId: number;
}
export const CONFIGURATION = "CONFIGURATION";
export interface ChatStreamConfiguration{
  models: string[];
  top_p: number;
  temperature: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  historySessionLength: number;
}
export interface ImageConfiguration{
  models: string[];
  n: number;
  size: string;
  response_format:string;
  quality: string;
  style: string;
}
export enum GPTType{
  ChatStream,
  Image
}
export interface Configuration{
  model: string;
  type: GPTType,
  chatConfiguration: ChatStreamConfiguration;
  imageConfiguration: ImageConfiguration;
  endpoint: string;
  accessKey?: string;
  baseUrl?: string;
  apiKey?: string;
}
