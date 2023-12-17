import {Component, EventEmitter, Output} from '@angular/core';
import {Configuration} from "../../../models";
import {ClipboardModule} from "ngx-clipboard";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {turboMask} from "../config-export/config-export.component";
import * as Buffer from 'buffer';
import {NzNotificationService} from "ng-zorro-antd/notification";
@Component({
  selector: 'app-config-import',
  templateUrl: './config-import.component.html',
  styleUrl: './config-import.component.css',
  standalone: true,
  imports: [
    ClipboardModule,
    FormsModule,
    NzButtonModule
  ]
})
export class ConfigImportComponent {
  @Output()
  configInput = new EventEmitter<Configuration>();
  json: string = '';
  constructor(private notification: NzNotificationService) {
  }
  analysis() {
    let ujson = '';
    if(this.json.startsWith(turboMask)){
      const buffer = Buffer.Buffer.from(this.json.substring(turboMask.length), 'base64');
      ujson = buffer.toString('utf-8');
    }else{
      ujson = this.json;
    }
    try{
      let config = JSON.parse(ujson);
      this.configInput.emit(config);
      // console.log(config)
      this.notification.success("导入配置成功","");
    }catch (error){
      this.notification.success("导入配置失败",`${error}`);
    }

  }
}
