import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigurationService} from "../share-datas/configuration.service";
import {Message} from "../models/message.model";
import {GPTType} from "../models/chat.interface";

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
    constructor(private configurationService: ConfigurationService) {}
    fetchData(messages: Message[] | string, type: GPTType): Observable<string> {
      let config = this.configurationService.configuration;
      let url = config?.endpoint!;
      if(type==GPTType.ChatStream){
        url += "/chat";
      }else{
        url+="/image";
      }
      let authorizationToken = config?.accessKey; // 替换为你的授权令牌
      if(!authorizationToken) authorizationToken = '';
      console.log("message")
      console.log(messages)
      let requestBody: any;
      if(type==GPTType.ChatStream){
        requestBody = {
          type: type,
          baseUrl: config?.baseUrl+'/v1',
          apiKey: config?.apiKey,
          body: {
            messages: messages,
            model: config?.model,
            frequency_penalty: config?.chatConfiguration.frequency_penalty,
            max_tokens: config?.chatConfiguration.max_tokens,
            presence_penalty: config?.chatConfiguration.presence_penalty,
            stream: true,
            temperature: config?.chatConfiguration.temperature,
            top_p: config?.chatConfiguration.top_p
          }
        };
      }else{
        requestBody = {
          type: type,
          baseUrl: config?.baseUrl+'/v1',
          apiKey: config?.apiKey,
          body: {
            model: config?.model,
            prompt: messages,
            n: config?.imageConfiguration.n,
            size: config?.imageConfiguration.size,
            quality: config?.imageConfiguration.quality,
            response_format: config?.imageConfiguration.response_format,
            style: config?.imageConfiguration.style
          }
        };
      }
      // console.log(JSON.stringify(requestBody))

      return new Observable<string>(observer => {
        fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': authorizationToken!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }).then(response => {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('ReadableStream not available');
          }
          function pump(): Promise<void> {
            return reader!.read().then(({ value, done }) => {
              if (done) {
                observer.complete();
                return;
              }
              // 处理接收到的数据
              if (value) {
                const chunk = new TextDecoder().decode(value);
                observer.next(chunk);
              }
              // 继续读取下一个数据块
              return pump();
            }).catch(error => {
              observer.error(error);
            });
          }
          return pump();
        }).catch(error => {
          observer.error(error);
        });
      });
    }
}
// use
// receivedData = '';
// message: string = '';
// constructor(private openaiService: OpenaiService) {
// }
// easyAsk(): void {
//   this.receivedData = ''
//   this.openaiService.fetchData(this.message).subscribe({
//     next: (data: any) => {
//       this.message = '';
//       this.receivedData += data;
//     },
//     error: (error: any) => {
//       console.error('Error fetching data:', error);
//     }
//   });
// }
