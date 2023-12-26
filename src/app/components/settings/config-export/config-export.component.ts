import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Configuration} from "../../../models";
import * as Buffer from 'buffer';
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ClipboardModule, ClipboardService} from "ngx-clipboard";
import {TranslateModule} from "@ngx-translate/core";

export const turboMask = "Turbo://";
@Component({
  selector: 'app-config-export',
  templateUrl: './config-export.component.html',
  styleUrl: './config-export.component.css',
  standalone: true,
  imports: [
    NzFormModule,
    FormsModule,
    NzButtonModule,
    ClipboardModule,
    TranslateModule
  ],
  providers: [
  ]
})
export class ConfigExportComponent {
  @Input()
  config: Configuration | undefined;
  lock: boolean = false;
  constructor(private clipboardService: ClipboardService) {
  }
  @ViewChild("textAreaElement")
  textAreaElement: ElementRef | undefined;
  getJson(){
    if(!this.config){
      return '';
    }
    let json = JSON.stringify(this.config,null,2);
    if(this.lock){
      const buffer = Buffer.Buffer.from(json, 'utf-8');
      return turboMask+buffer.toString('base64');
    }
    return json;
  }


  copyConfig() {
    this.clipboardService.copy(this.textAreaElement?.nativeElement.value);
  }
}
