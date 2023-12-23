import {Component, Input} from '@angular/core';
import {ChatModel, ImageList} from "../../../models";
import {ConfigurationService} from "../../../share-datas";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {MarkdownRootComponent} from "../markdown-root/markdown-root.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-stt',
  templateUrl: './stt.component.html',
  styleUrl: './stt.component.css',
  imports: [
    NzSpinModule,
    MarkdownRootComponent,
    NgIf
  ],
  standalone: true
})
export class SttComponent {

  private _chatModel: ChatModel | undefined;
  private _content: string | undefined;
  time: number = 0;
  pending: boolean = true;
  private timerInterval: any;
  constructor() {
    this.startTimer();
  }
  @Input()
  set content(value: string | undefined) {
    this._content = value;
    if (this._content === undefined || this._content.trim() === '') {

    } else {
      this.stopTimer();
    }
  }

  @Input()
  set chatModel(value: ChatModel | undefined) {
    this._chatModel = value;
  }

  get chatModel(): ChatModel | undefined {
    return this._chatModel;
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
