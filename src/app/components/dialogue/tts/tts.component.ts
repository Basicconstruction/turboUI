import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ChatModel} from "../../../models";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Bs64Handler} from "../../../handlers/bs64Handler";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzCardModule} from "ng-zorro-antd/card";

@Component({
  selector: 'app-tts',
  templateUrl: './tts.component.html',
  styleUrl: './tts.component.css',
  imports: [
    NzSpinModule,
    NzCardModule,
  ],
  standalone: true
})
export class TtsComponent {
  private _chatModel: ChatModel | undefined;
  @ViewChild('player') player: ElementRef<HTMLAudioElement> | undefined;
  @ViewChild('musicIcon') musicIcon: ElementRef<HTMLImageElement> | undefined;
  isAudioPlaying: boolean = false;
  time: number = 0;
  pending: boolean = true;
  private timerInterval: any;
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
  private _content: string | undefined;
  @Input()
  set content(value: number | undefined) {
    if(this.chatModel?.content===undefined) return;
    if (value === undefined || value === 0) {

    } else {
      this.stopTimer();
    }
    try{
      const blob = this.bs64Handler.base64toBlob(this.chatModel?.content, 'audio/mpeg');
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
  constructor(private sanitizer: DomSanitizer,private bs64Handler: Bs64Handler) {
    this.startTimer();
  }
  audioSrc: SafeUrl | undefined;
  ngOnInit() {
    const base64Data = this.chatModel?.content; // 获取 Base64 数据
    if(base64Data===undefined) return;
    try{
      const blob = this.bs64Handler.base64toBlob(base64Data, 'audio/mpeg');
      this.audioSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)); // 创建安全的 URL
    }catch (e){

    }
  }

  loading() {
    return this.chatModel?.finish === false;
  }
  delta = 200;
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.time++;
      if(this.time>this.delta){
        clearInterval(this.timerInterval);
      }
    },100);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.pending = false;
  }

  getPendingText() {
    return `Already waiting ${this.time/10}s, please wait patiently`;
  }
}
