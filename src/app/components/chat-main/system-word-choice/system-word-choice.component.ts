import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SystemPromptItem} from "../../../models";
import {SystemPromptService} from "../../../share-datas/system-prompt.service";
import {NzFormModule} from "ng-zorro-antd/form";
import {NgForOf, NgTemplateOutlet} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-system-word-choice',
  templateUrl: './system-word-choice.component.html',
  styleUrl: './system-word-choice.component.css',
  imports: [
    NzFormModule,
    NgForOf,
    NzButtonModule,
    RouterLink,
    NzCardModule,
    NgTemplateOutlet,
    TranslateModule
  ],
  standalone: true
})
export class SystemWordChoiceComponent{
  @Output()
  chooseSystemPrompt = new EventEmitter<SystemPromptItem | undefined>();
  systemPrompts: SystemPromptItem[] | undefined;
  constructor(private systemInfoService: SystemPromptService) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
  }
  @Output()
  close = new EventEmitter<any>();

  release(info?: SystemPromptItem) {
    this.chooseSystemPrompt.emit(info);
    this.close.emit(true);
  }
}
