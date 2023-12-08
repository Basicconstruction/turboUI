import {
  Component, Input
} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css'
})
export class MarkdownRootComponent
{
  constructor(private notification: NzNotificationService) {

  }
  @Input()
  set content(value: string | undefined) {
    this._content = value;
  }

  get content() {
    return this._content === undefined ? '' : this._content;
  }

  private _content: string | undefined;
  onCopyToClipboard() {
    this.notification.success("复制成功","");
  }
}
