import {
  Component, Input
} from '@angular/core';
@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css',
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
