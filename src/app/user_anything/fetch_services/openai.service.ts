import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigurationService} from "../data-services";

import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {
  ChatPacket,
  ChatVisionPacket,
  ImagePacket,
  Message,
  SpeechPacket,
  TranscriptionPacket,
  VisionMessage
} from "../models";

@Injectable()
export class OpenaiService {
  constructor(private configurationService: ConfigurationService, private http: HttpClient) {
  }
  fetchChat(mp: ChatPacket,model?: string): Observable<string> {
    const messages: Message[] = mp.messages;
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/chat";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        messages: messages,
        model: model===undefined? config?.model:model,
        frequency_penalty: config?.chatConfiguration.frequency_penalty,
        max_tokens: config?.chatConfiguration.max_tokens,
        presence_penalty: config?.chatConfiguration.presence_penalty,
        stream: true,
        temperature: config?.chatConfiguration.temperature,
        top_p: config?.chatConfiguration.top_p
      }
    };
    return this.fetchChatBase(url,requestBody,authorizationToken);
  }
  fetchChatVision(mp: ChatVisionPacket,model?: string): Observable<string> {
    const messages:VisionMessage[] = mp.messages;
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/vision";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        messages: messages,
        model: model===undefined? config?.model:model,
        max_tokens: config?.chatConfiguration.max_tokens,
        stream: true,
        temperature: config?.chatConfiguration.temperature,
      }
    };
    return this.fetchChatBase(url,requestBody,authorizationToken);

  }
  fetchChatBase(url: string,requestBody: any,authorizationToken: string): Observable<string>{
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
      'Authorization': authorizationToken!,
      'Content-Type': "application/json"
    });

    return new Observable<string>(observer => {
      this.http.post(url, requestBody, {headers, responseType: 'text'})
        .subscribe({
            next: value => {
              observer.next(value);
              observer.complete();
            },
            error: error => {
              observer.next(error);
              observer.complete();
            },
          }
        );
    });
  }

  fetchUpload(url: string, formData: FormData, authorizationToken?: string): Observable<any> {
    const req = new HttpRequest('POST', url, formData, {
      responseType: "text"
    });

    return new Observable<any>(observer => {
      this.http.request(req).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            observer.next(event.body); // Assuming you're expecting a body in the response
            // console.log("body: ")
            // console.log(event.body)
          }
        },
        error: error => {
          observer.error(error);
          observer.complete();
        },
        complete: () => {
          observer.complete();
        }
      });
    });
  }
  fetchImage(imp: ImagePacket,model?: string): Observable<string> {
    const prompt: string = imp.prompt;
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/image";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    let requestBody: any;
    requestBody = {
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        model: model===undefined? config?.model:model,
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

  fetchTTS(sp: SpeechPacket,model?: string): Observable<string> {
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/tts";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    const formData = new FormData();
    if (sp.fileList) {
      sp.fileList.forEach((file: any) => {
        formData.append('files[]', file);
      });
    }
    let requestBody: any;
    requestBody = {
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        model: model===undefined? config?.model:model,
        input: sp.text,
        voice: config?.speechConfiguration.voice,
        speed: config?.speechConfiguration.speed,
        response_format: config?.speechConfiguration.response_format,
      }
    }
    formData.append('packet', JSON.stringify(requestBody));
    return this.fetchUpload(url, formData, authorizationToken);
  }

  fetchSTT(stt: TranscriptionPacket,model?: string): Observable<string> {
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/stt";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    const formData = new FormData();
    if (stt.fileList) {
      stt.fileList.forEach((file: any) => {
        formData.append('files[]', file);
      });
    }
    let requestBody: any;
    let body = {
      transcription: stt.transcription,
      model: model===undefined? config?.model:model,
      prompt: stt.prompt,
      language: config?.transcriptionConfiguration.language,
      temperature: config?.transcriptionConfiguration.temperature,
    };
    requestBody = {
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: body,
    }
    formData.append('packet', JSON.stringify(requestBody));
    return this.fetchUpload(url, formData, authorizationToken);
  }
}

