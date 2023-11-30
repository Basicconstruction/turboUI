import {Component, Input} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-tts',
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.css'
})
export class TtsComponent {
  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  @Input()
  set content(value: string | undefined) {
    this._content = value;
    if(this.chatModel?.content===undefined) return;
    try{
      const blob = this.base64toBlob(this.chatModel?.content, 'audio/mpeg');
      this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // 创建安全的 URL
    }catch (e){

    }
  }
  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }
  constructor(private sanitizer: DomSanitizer) {}
  audioSrc: SafeUrl | undefined;
  ngOnInit() {
    // 假设 chatModel?.content 包含 Base64 编码的音频数据
    const base64Data = this.chatModel?.content; // 获取 Base64 数据
    if(base64Data===undefined) return;
    try{
      const blob = this.base64toBlob(base64Data, 'audio/mpeg');
      this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // 创建安全的 URL
    }catch (e){

    }

  }

  // 辅助函数，将 Base64 数据转换为 Blob URL
  base64toBlob(base64Data: string, contentType: string): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  loading() {
    return this.chatModel?.finish === false;
  }
}
