import {Injectable} from '@angular/core';
import {filter, Observable} from 'rxjs';
import {ConfigurationService} from "../share-datas";
import {Message} from "../models";

import {GPTType} from "../models/GPTType";
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {ChatPacket, ImagePacket, SpeechPacket, TranscriptionPacket} from "../models";
import {SymbolBuilder} from "@angular/compiler-cli/src/ngtsc/typecheck/src/template_symbol_builder";

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
            console.log("body: ")
            console.log(event.body)
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

  fetchTTS(sp: SpeechPacket): Observable<string> {
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
      type: GPTType.Image,
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: {
        model: config?.model,
        input: sp.text,
        voice: config?.speechConfiguration.voice,
        speed: config?.speechConfiguration.speed,
        response_format: config?.speechConfiguration.response_format,
      }
    }
    formData.append('packet', JSON.stringify(requestBody));
    return this.fetchUpload(url, formData, authorizationToken);
  }

  fetchSTT(stt: TranscriptionPacket): Observable<string> {
    let config = this.configurationService.configuration;
    let url = config?.endpoint!;
    url += "/stt";
    let authorizationToken = config?.accessKey; // 替换为你的授权令牌
    if (!authorizationToken) authorizationToken = '';
    const formData = new FormData();
    const transcriptionPacket = stt;
    if (transcriptionPacket.fileList && transcriptionPacket.fileList.length > 0) {
      for (let i = 0; i < transcriptionPacket.fileList.length; i++) {
        formData.append('files[]', transcriptionPacket.fileList[i].originFileObj as File);
      }
    }
    let requestBody: any;
    let body = {
      transcription: stt.transcription,
      model: config?.model,
      prompt: stt.prompt,
      language: config?.transcriptionConfiguration.language,
      temperature: config?.transcriptionConfiguration.temperature,
    };
    requestBody = {
      type: GPTType.Image,
      baseUrl: config?.baseUrl + '/v1',
      apiKey: config?.apiKey,
      body: body,
    }
    formData.append('packet', requestBody);
    return this.fetchUpload(url, formData, authorizationToken);
  }
}

