import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ConfigurationService} from "../../../share-datas";

@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css'
})
export class MarkdownRootComponent {
  constructor(private configurationService: ConfigurationService) {

  }
  @Input()
  set content(value: string){
    this._content = value;
    this.syncFontSize();
  }
  get content(){
    return this._content===undefined?'':this._content;
  }
  private _content: string | undefined;

  @ViewChild('markdownContent', { read: ElementRef }) markdownContent: ElementRef|undefined;
  syncFontSize() {
    if(!this.markdownContent) return;
    const elements = this.markdownContent.nativeElement.querySelectorAll('pre');
    elements.forEach((element: HTMLElement) => {
      element.style.fontSize = `${this.configurationService.configuration?.displayConfiguration.fontSize}px !important`;
    });
  }
}
