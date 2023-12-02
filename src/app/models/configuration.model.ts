import {RequestType} from "./GPTType";

export class ChatStreamConfigurationModel {
  constructor(
    public models: string[],
    public historySessionLength: number,
    public top_p?: number,
    public temperature?: number,
    public max_tokens?: number,
    public presence_penalty?: number,
    public frequency_penalty?: number,

  ) {}
}

export class ImageConfigurationModel {
  constructor(
    public models: string[],
    public n?: number,
    public size?: string,
    public response_format?:string,
    public quality?: string,
    public style?: string
  ) {}
}

export class ConfigurationModel {
  constructor(
    public model: string,
    public requestType: RequestType,
    public chatConfiguration: ChatStreamConfigurationModel,
    public imageConfiguration: ImageConfigurationModel,
    public speechConfiguration: SpeechConfigurationModel,
    public transcriptionConfiguration: TranscriptionConfigurationModel,
    public endpoint: string,
    public accessKey?: string,
    public baseUrl?: string,
    public apiKey?: string
  ) {}
}
export class SpeechConfigurationModel {
  constructor(
    public models: string[],
    public voice: string,
    public response_format?: string,
    public speed?: number
  ) {}
}

export class TranscriptionConfigurationModel {
  constructor(
    public models: string[],
    public temperature?: number,
    public language?: string,
    public transcription?: boolean
    // public response_format: string = 'json',
  ) {}
}

