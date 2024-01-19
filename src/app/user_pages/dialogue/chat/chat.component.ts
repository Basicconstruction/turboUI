import {Component, Input} from '@angular/core';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {MarkdownRootComponent} from "../markdown-root/markdown-root.component";
import {ChatModel} from "../../../user_anything/models";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  imports: [
    NzIconModule,
    NzSpinModule,
    MarkdownRootComponent
  ],
  standalone: true
})
export class ChatComponent {
  private _chatModel: ChatModel | undefined;
  time: number = 0;
  pending: boolean = true;
  private timerInterval: any;
  constructor() {
    this.startTimer();
  }

  @Input()
  set content(value: number | undefined) {
    if (value === undefined || value===0) {

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
