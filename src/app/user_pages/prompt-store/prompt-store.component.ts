import {Component, Inject} from '@angular/core';
import {SystemPromptService} from "../../user_anything/data-services/system-prompt.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Observable} from "rxjs";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ExportPromptsComponent} from "./export-prompts/export-prompts.component";
import {ImportPromptsComponent} from "./import-prompts/import-prompts.component";
import {CreatePromptComponent} from "./create-prompt/create-prompt.component";
import {LookUpdatePromptComponent} from "./look-update-prompt/look-update-prompt.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzInputModule} from "ng-zorro-antd/input";
import {systemPromptChangeSubject} from "../../user_anything/injection_tokens/subject.data";
import {TranslateModule} from "@ngx-translate/core";
import {SystemPromptItem} from "../../user_anything/models";

@Component({
  selector: 'app-prompt-store',
  templateUrl: './prompt-store.component.html',
  styleUrl: './prompt-store.component.css',
  imports: [
    NzModalModule,
    ExportPromptsComponent,
    ImportPromptsComponent,
    CreatePromptComponent,
    LookUpdatePromptComponent,
    NzButtonModule,
    RouterLink,
    NzIconModule,
    NzCardModule,
    NzFormModule,
    FormsModule,
    NzSkeletonModule,
    NzInputModule,
    TranslateModule
  ],
  standalone: true
})
export class PromptStoreComponent {
  systemPrompts: SystemPromptItem[] | undefined;
  filterText: string = '';
  constructor(private systemInfoService: SystemPromptService,
              private notification: NzNotificationService,
              @Inject(systemPromptChangeSubject) private promptObservable: Observable<boolean>) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
    for(let item of this.systemPrompts!){
      this.filterPrompts.push(item);
    }
    this.promptObservable.subscribe(()=>{
      // this.systemPrompts = this.systemInfoService.systemPrompts;
      this.filter();
    })
  }
  filterPrompts: SystemPromptItem[] = [];
  filter(){
    this.filterPrompts.length = 0;
    let search = this.filterText.trim();
    for(let item of
      this.systemPrompts!.filter(s=>s.content.includes(search) || s.title!.includes(search))){
      this.filterPrompts.push(item);
    }
  }
  exportVisible: boolean = false;
  importVisible: boolean = false;
  createVisible: boolean = false;
  lookVisible: boolean = false;

  deletePrompt(id: number | undefined) {
    if(id===undefined) return;
    // this.systemPrompts = this.systemPrompts!
    //   .filter(p=>p.id!==id);
    let index = this.systemPrompts?.findIndex(s=>s.id===id);
    if(index===undefined) return;
    this.systemPrompts?.splice(index,1);
    try{
      this.systemInfoService.deletePrompt(id).then(()=>{
        // this.notification.success("删除系统预设信息成功","");
        this.filter();
      });

    }catch (e: any){
      this.notification.error("删除系统预设信息失败",e.toString());
    }
  }

  exportClose() {
    this.exportVisible = false;
    this.filter();
  }

  importClose() {
    this.importVisible = false;
    this.filter();
  }

  createClose() {
    this.createVisible = false;
    this.filter();
  }

  lookClose() {
    this.lookVisible = false;
    this.filter();
  }

  deleteAllFilterPrompts() {
    for(let prompt of this.filterPrompts){
      this.deletePrompt(prompt.id);
    }
  }

  lookPrompt: SystemPromptItem | undefined;
  lookModalOpen(id: number | undefined) {
    if(id===undefined) return;
    let prompt = this.systemPrompts?.find(p=>p.id===id);
    if(prompt===undefined) return;
    this.lookPrompt = prompt;
    this.lookVisible = true;
  }
}
