import {Injectable} from "@angular/core";
import {ConfigurationService} from "../data-services";
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../../share/auth_module";
import {
  ChatPacket,
  ChatVisionPacket,
  ImagePacket,
  Message,
  SpeechPacket,
  TranscriptionPacket,
  VisionMessage
} from "../models";
import {provide} from "../../share/roots";

@Injectable({
  providedIn: "root"
})
export class TurboService {
  baseUrl: string = `${provide()}/api/ai`;

  constructor(private configurationService: ConfigurationService,
              private http: HttpClient,
              private authService: AuthService) {

  }

  fetchChat(mp: ChatPacket, model?: string): Observable<string> {
    const messages: Message[] = mp.messages;
    let config = this.configurationService.configuration;
    let url = this.baseUrl + "/chat";
    let requestBody: any;
    requestBody = {
      messages: messages,
      model: model === undefined ? config?.model : model,
      frequency_penalty: config?.chatConfiguration.frequency_penalty,
      max_tokens: config?.chatConfiguration.max_tokens,
      presence_penalty: config?.chatConfiguration.presence_penalty,
      stream: true,
      temperature: config?.chatConfiguration.temperature,
      top_p: config?.chatConfiguration.top_p
    };
    return this.fetchChatBase(url, requestBody);
  }

  fetchChatVision(mp: ChatVisionPacket, model?: string): Observable<string> {
    const messages: VisionMessage[] = mp.messages;
    let config = this.configurationService.configuration;
    let url = this.baseUrl + "/vision";
    let requestBody: any;
    requestBody = {
      messages: messages,
      model: model === undefined ? config?.model : model,
      max_tokens: config?.chatConfiguration.max_tokens,
      stream: true,
      temperature: config?.chatConfiguration.temperature,
    };
    return this.fetchChatBase(url, requestBody);

  }

  fetchChatBase(url: string, requestBody: any): Observable<string> {
    return new Observable<string>(observer => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.token}`
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

  fetchBase(url: string, requestBody: any): Observable<string> {
    const headers = new HttpHeaders({
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

  fetchUpload(url: string, formData: FormData): Observable<any> {
    const req = new HttpRequest('POST', url, formData, {
      responseType: "text"
    });

    return new Observable<any>(observer => {
      this.http.request(req).subscribe({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            observer.next(event.body);
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

  fetchImage(imp: ImagePacket, model?: string): Observable<string> {
    const prompt: string = imp.prompt;
    let config = this.configurationService.configuration;
    let url = this.baseUrl + "/image";
    let requestBody: any;
    requestBody = {
      model: model === undefined ? config?.model : model,
      prompt: prompt,
      n: config?.imageConfiguration.n,
      size: config?.imageConfiguration.size,
      quality: config?.imageConfiguration.quality,
      response_format: config?.imageConfiguration.response_format,
      style: config?.imageConfiguration.style

    };
    return this.fetchBase(url, requestBody);
  }

  fetchTTS(sp: SpeechPacket, model?: string): Observable<string> {
    let config = this.configurationService.configuration;
    let url = this.baseUrl + "/tts";
    const formData = new FormData();
    if (sp.fileList) {
      sp.fileList.forEach((file: any) => {
        formData.append('files[]', file);
      });
    }
    let requestBody: any;
    requestBody = {
      model: model === undefined ? config?.model : model,
      input: sp.text,
      voice: config?.speechConfiguration.voice,
      speed: config?.speechConfiguration.speed,
      response_format: config?.speechConfiguration.response_format,
    }
    formData.append('packet', JSON.stringify(requestBody));
    return this.fetchUpload(url, formData);
  }

  fetchSTT(stt: TranscriptionPacket, model?: string): Observable<string> {
    let config = this.configurationService.configuration;
    let url = this.baseUrl + "/stt";
    const formData = new FormData();
    if (stt.fileList) {
      stt.fileList.forEach((file: any) => {
        formData.append('files[]', file);
      });
    }
    let body = {
      transcription: stt.transcription,
      model: model === undefined ? config?.model : model,
      prompt: stt.prompt,
      language: config?.transcriptionConfiguration.language,
      temperature: config?.transcriptionConfiguration.temperature,
    };
    formData.append('packet', JSON.stringify(body));
    return this.fetchUpload(url, formData);
  }
}
