import {
  Component, Input
} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {CopiedButtonComponent} from "./copied-button/copied-button.component";
import {MarkdownComponent} from "ngx-markdown";

@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css',
  imports: [
    CopiedButtonComponent,
    MarkdownComponent
  ],
  standalone: true
})
export class MarkdownRootComponent
{
  constructor() {

  }
  @Input()
  set content(value: string | undefined) {
    this._content = value;
  }

  get content() {
    return this._content === undefined ? '' : this._content;
  }

  private _content: string | undefined;

}
