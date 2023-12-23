import {Component, Input} from '@angular/core';
import {ChatModel} from "../../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ChatModule} from "../../chat.module";
import {NgIf} from "@angular/common";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {MarkdownRootComponent} from "../markdown-root/markdown-root.component";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [
    NgIf,
    NzIconModule,
    NzSpinModule,
    MarkdownRootComponent
  ],
  standalone: true
})
export class ChatComponent {
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
    // console.log("aware change")
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
  delta = 100;
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
