import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Bs64Handler} from "../../../user_anything/handlers";
import {NzCardModule} from "ng-zorro-antd/card";
import {ChatModel} from "../../../user_anything/models";

@Component({
  selector: 'app-static-tts',
  templateUrl: './static-tts.component.html',
  styleUrl: './static-tts.component.css',
  imports: [
    NzCardModule
  ],
  providers:[
    Bs64Handler
  ],
  standalone: true
})
export class StaticTtsComponent {
  private _chatModel: ChatModel | undefined;

  @ViewChild('player') player: ElementRef<HTMLAudioElement> | undefined;
  @ViewChild('musicIcon') musicIcon: ElementRef<HTMLImageElement> | undefined;
  isAudioPlaying: boolean = false;

  onAudioPlay() {
    this.isAudioPlaying = true;
    if(!this.musicIcon) return;
    this.musicIcon.nativeElement.classList.add('playing');
  }

  onAudioPause() {
    this.isAudioPlaying = false;
    if(!this.musicIcon) return;
    this.musicIcon.nativeElement.classList.remove('playing');
  }
  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
  }
  constructor(private sanitizer: DomSanitizer, private bs64Handler: Bs64Handler) {
  }

  audioSrc: SafeUrl | undefined;
  ngOnInit() {
    // 假设 chatModel?.content 包含 Base64 编码的音频数据
    const base64Data = this.chatModel?.content; // 获取 Base64 数据
    if(base64Data===undefined) return;
    try{
      const blob = this.bs64Handler.base64toBlob(base64Data, 'audio/mpeg');
      this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // 创建安全的 URL
    }catch (e){

    }

  }


}
