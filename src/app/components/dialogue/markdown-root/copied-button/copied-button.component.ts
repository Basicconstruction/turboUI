import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-copied-button',
  templateUrl: './copied-button.component.html',
  standalone: true
})
export class CopiedButtonComponent {
  @ViewChild("buttonElement")
  buttonElement: ElementRef | undefined;
  onCopyToClipboard() {
    if(!this.buttonElement) return;
    this.buttonElement.nativeElement.textContent = "复制成功";

    setTimeout(() =>
      {
        this.buttonElement!.nativeElement.textContent = "复制代码";
        }
      , 2000);
  }
}
