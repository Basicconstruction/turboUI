import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-copied-button',
  templateUrl: './copied-button.component.html',
})
export class CopiedButtonComponent {
  @ViewChild("buttonElement")
  buttonElement: ElementRef | undefined;
  onCopyToClipboard() {
    if(!this.buttonElement) return;
    this.buttonElement.nativeElement.textContent = "copied";

    setTimeout(() =>
      {
        this.buttonElement!.nativeElement.textContent = "copy code";
        }
      , 2000);
  }
}
