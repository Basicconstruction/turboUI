import {GPTType} from "./GPTType";

export interface Configuration{
  model: string;
  type: GPTType,
  chatConfiguration: ChatStreamConfiguration;
  imageConfiguration: ImageConfiguration;
  speechConfiguration: SpeechConfiguration,
  transcriptionConfiguration: TranscriptionConfiguration,
  endpoint: string;
  accessKey?: string;
  baseUrl?: string;
  apiKey?: string;
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

