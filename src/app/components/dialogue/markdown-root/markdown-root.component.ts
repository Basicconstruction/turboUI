import {
  Component, Input
} from '@angular/core';
import {CopiedButtonComponent} from "./copied-button/copied-button.component";
import {MarkdownComponent} from "ngx-markdown";
import {SafeHtmlPipe} from "./safeHtml.directive";

@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css',
  imports: [
    CopiedButtonComponent,
    MarkdownComponent,
    SafeHtmlPipe
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
