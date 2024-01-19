import {Component, ElementRef, ViewChild} from '@angular/core';
import {SystemPromptService} from "../../../user_anything/data-services/system-prompt.service";
import {ClipboardModule, ClipboardService} from "ngx-clipboard";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SystemPromptItem} from "../../../user_anything/models";

@Component({
  selector: 'app-export-prompts',
  templateUrl: './export-prompts.component.html',
  styleUrl: './export-prompts.component.css',
  imports: [
    NzButtonModule,
    NzFormModule,
    ClipboardModule,
    FormsModule,
    TranslateModule
  ],
  standalone: true
})
export class ExportPromptsComponent {
  prompts: SystemPromptItem[] | undefined;

  constructor(private systemPromptService: SystemPromptService,
              private clipboardService: ClipboardService) {
    this.prompts = this.systemPromptService.systemPrompts;
  }

  @ViewChild("textAreaElement")
  textAreaElement: ElementRef | undefined;

  getJson() {
    let promptList = [...this.prompts!];
    for (let prompt of promptList) {
      prompt.id = undefined;
    }
    return JSON.stringify(promptList, null, 2);
  }

  copyToClipboard() {
    this.clipboardService.copy(this.textAreaElement?.nativeElement.value);
  }

  exportToFile() {
    const blob = new Blob([this.textAreaElement?.nativeElement.value], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turbo.prompts.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }


}
