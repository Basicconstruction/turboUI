import {Message} from "./message.model";

export class ChatStreamModel{
  //https://platform.openai.com/docs/api-reference/chat/create
  public stream: boolean = true
  constructor(public model: string,public messages: Message[],
              public temperature?: number,
              public frequency_penalty?: number,
              public max_tokens?: number,
              public presence_penalty?: number,
              public top_p?: number,
              ) {

  }
}
