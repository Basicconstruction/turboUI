import {RequestType} from "./enumerates";


export interface Configuration{
  model: string;
  requestType: RequestType,
  chatConfiguration: ChatStreamConfiguration;
  imageConfiguration: ImageConfiguration;
  speechConfiguration: SpeechConfiguration,
  transcriptionConfiguration: TranscriptionConfiguration,
  displayConfiguration: DisplayConfiguration,
  endpoint: string;
  accessKey?: string;
  baseUrl?: string;
  apiKey?: string;
  dynamic?: string;
}
export interface DisplayConfiguration{
  fontSize?: string;
}
export const CONFIGURATION = "CONFIGURATION";
export interface ChatStreamConfiguration{
  models: string[];
  top_p?: number;
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  historySessionLength: number;
  detail?: string;
}
export interface ImageConfiguration{
  models: string[];
  n?: number;
  size?: string;
  response_format?:string;
  quality?: string;
  style?: string;
}
export interface SpeechConfiguration{
  models: string[];
  voice: string;//
  response_format?: string;
  speed?: number;
}
export interface TranscriptionConfiguration{
  models: string[];
  language?: string;// ISO-639-1 format
  // response_format 默认提供json
  temperature?: number;
  transcription?: boolean;
}

export interface DynamicConfig{
  systemInfo?: SystemInfoConfig;
  theme?: string;
  language?: string;
  languageIsSet?: boolean;
}
export interface SystemInfoConfig{
  letChoice?: boolean;// 打开新的聊天时让用户选择系统信息
}

