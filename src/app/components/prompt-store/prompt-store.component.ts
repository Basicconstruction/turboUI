import {Component, Inject} from '@angular/core';
import {SystemPromptService} from "../../share-datas/system-prompt.service";
import {SystemPromptItem} from "../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {systemPromptChangeSubject} from "../../share-datas/datas.module";
import {Observable} from "rxjs";

@Component({
  selector: 'app-prompt-store',
  templateUrl: './prompt-store.component.html',
  styleUrl: './prompt-store.component.css'
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
