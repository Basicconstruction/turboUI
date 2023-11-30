import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigurationService} from "../share-datas";
import {Message} from "../models";

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

    fetchBase(url: string, requestBody: any,contentType: string = "", authorizationToken?: string): Observable<string> {

        const headers = new HttpHeaders({
            'Authorization': authorizationToken === undefined ? '' : authorizationToken,
            'Content-Type': contentType!
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
        return this.fetchBase(url, requestBody,"application/json", authorizationToken);
    }

    fetchTTS(sp: SpeechPacket): Observable<string> {
        let config = this.configurationService.configuration;
        let url = config?.endpoint!;
        url += "/tts";
        let authorizationToken = config?.accessKey; // 替换为你的授权令牌
        if (!authorizationToken) authorizationToken = '';
        const formData = new FormData();
        const speechPacket = sp;
        if (speechPacket.fileList && speechPacket.fileList.length > 0) {
            for (let i = 0; i < speechPacket.fileList.length; i++) {
                formData.append('files[]', speechPacket.fileList[i].originFileObj as File);
            }
        }
        console.log(sp.fileList)
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
        // formData.set('packet', requestBody);
        // console.log(formData);
        return this.fetchBase(url, formData,"multipart/form-data", authorizationToken);
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
        return this.fetchBase(url, formData,"multipart/form-data", authorizationToken);
    }
}

