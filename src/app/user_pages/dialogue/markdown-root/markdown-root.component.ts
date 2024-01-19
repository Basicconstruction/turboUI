import {
  Component, Input
} from '@angular/core';
import {MarkdownModule} from "ngx-markdown";
import {CopiedButtonComponent} from "./copied-button/copied-button.component";
import {EscapeHtmlPipe} from "./simple-sanitizer.pipe";
import {CwPipe} from "./cw.pipe";
@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css',
  standalone: true,
  imports: [
    MarkdownModule,
    CopiedButtonComponent,
    EscapeHtmlPipe,
    CwPipe
  ]
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
