import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {SystemPromptService} from "../../../share-datas/system-prompt.service";
import {NzUploadFile} from "ng-zorro-antd/upload";

@Component({
  selector: 'app-import-prompts',
  templateUrl: './import-prompts.component.html',
  styleUrl: './import-prompts.component.css'
})
export class ImportPromptsComponent {
  json: string = '';
  constructor(private notification: NzNotificationService,
              private systemPromptService: SystemPromptService) {

  }
  @ViewChild("textAreaElement")
  textAreaElement: ElementRef | undefined;
  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = ()=>{
      this.textAreaElement!.nativeElement.value = reader.result;
    };
    if(file){
      //@ts-ignore
      reader.readAsText(file);
    }
    return false;
  };
  async analysis(){
    try{
      if(this.textAreaElement?.nativeElement.value.trim().length===0) return;
      let noneIdItems: {
        title: string,
        content: string
      }[] = JSON.parse(this.textAreaElement?.nativeElement.value);
      for(let item of noneIdItems!){
        await this.systemPromptService.addOrPutPrompts({
          id: 0,
          title: item.title,
          content: item.content
        });
      }
      this.notification.success("系统预设导入成功","");
      this.systemPromptService.reLoad().then(()=>{
        this.notification.success("系统预设信息重载成功","");
      });

    }catch (e: any){
      this.notification.error("系统预设导入失败",e.toString());
    }

  }

}
