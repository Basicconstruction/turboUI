import {GPTType} from "./chat.interface";

export class ChatStreamConfiguration {
  constructor(
    public models: string[],
    public top_p: number,
    public temperature: number,
    public max_tokens: number,
    public presence_penalty: number,
    public frequency_penalty: number,
    public historySessionLength: number
  ) {}
}

export class ImageConfiguration {
  constructor(
    public models: string[],
    public n: number,
    public size: string,
    public response_format:string,
    public quality: string,
    public style: string
  ) {}
}

export class ConfigurationModel {
  constructor(
    public model: string,
    public type: GPTType,
    public chatConfiguration: ChatStreamConfiguration,
    public imageConfiguration: ImageConfiguration,
    public endpoint: string,
    public accessKey?: string,
    public baseUrl?: string,
    public apiKey?: string
  ) {}
}
