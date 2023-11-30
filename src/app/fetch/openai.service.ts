import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigurationService} from "../share-datas/configuration.service";
import {Message} from "../models/message.model";

import {GPTType} from "../models/GPTType";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ChatPacket, ImagePacket, SpeechPacket, TranscriptionPacket} from "../models";

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  constructor(private configurationService: ConfigurationService, private http: HttpClient) {
  }

  fetchChat(mp: ChatPacket): Observable<string> {
    const messages: Message[] = mp.message;
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/chat";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {
      type: GPTType.ChatStream,
      baseUrl: config?.baseUrl + '/v1',
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
          return reader!.read().then(({value, done}) => {
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

  fetchBase(url: string, requestBody: any, authorizationToken?: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': authorizationToken === undefined ? '' : authorizationToken,
      'Content-Type': 'application/json'
    });

    return new Observable<string>(observer => {
      this.http.post(url, requestBody, {headers, responseType: 'text'})
        .subscribe({
            next: value => {
              observer.next(value);
              observer.complete();
            },
            error: error => {
              observer.next(error)
            },
          }
        );
    });
  }

  fetchImage(imp: ImagePacket): Observable<string> {
    const prompt: string = imp.prompt;
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/image";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {
      type: GPTType.Image,
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        model: config?.model,
        prompt: prompt,
        n: config?.imageConfiguration.n,
        size: config?.imageConfiguration.size,
        quality: config?.imageConfiguration.quality,
        response_format: config?.imageConfiguration.response_format,
        style: config?.imageConfiguration.style
      }
    };
    return this.fetchBase(url, requestBody, authorizationToken);
  }
  fetchTTS(sp: SpeechPacket): Observable<string>{
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/tts";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {

    }
    return this.fetchBase(url, requestBody, authorizationToken);
  }
  fetchSTT(stp: TranscriptionPacket): Observable<string>{
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/stt";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {

    }
    return this.fetchBase(url, requestBody, authorizationToken);
  }
}

