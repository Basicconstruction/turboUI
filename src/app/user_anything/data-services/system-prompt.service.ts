import {Inject, Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {DatasModule} from "./datas.module";
import {Observer} from "rxjs";
import {timeToWait} from "./configuration.service";
import {systemPromptChangeSubject} from "../injection_tokens/subject.data";
import {SystemPromptItem} from "../models";

@Injectable({
  providedIn: DatasModule
})
export class SystemPromptService {
  public systemPrompts: SystemPromptItem[] | undefined;
  private initFinish = false;
  constructor(private dbService: DbService,
              @Inject(systemPromptChangeSubject)
              private promptChangeObserver:Observer<boolean>
              ) {
    this.Init();
  }
  public async Init(){
    this.systemPrompts = [];
    this.initFinish = true;
    this.dbService.waitForDbInit().then(async () => {
      this.getSystemPrompts().then(
                  (systemInfoList) => {
        if (systemInfoList !== undefined) {
          console.info("系统预设加载成功")
          this.systemPrompts!.length = 0;
          for(let info of systemInfoList){
            this.systemPrompts?.push(info)
          }
          this.promptChangeObserver.next(true);
        }
      });
    });
  }
  public async accept() {
    if (this.systemPrompts !== undefined) {
      return true;
    } else {
      await this.waitThisInit();
      return true;
    }
  }

  private async waitThisInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, timeToWait);
      }
    });
  }

  private getSystemPrompts():Promise<SystemPromptItem[] | undefined> {
    return this.dbService.getSystemPrompts();
  }
  public getMaxId():Promise<number>{
    return this.dbService.getMaxPromptId();
  }
  private addOrPutPromptsQueue: SystemPromptItem[] = [];
  private isAddOrPutPromptsRunning: boolean = false;

  // 没有考虑细粒度的并发操作
  public async addOrPutPrompts(prompt: SystemPromptItem){
    this.addOrPutPromptsQueue.push(prompt);

    if(this.isAddOrPutPromptsRunning){
      // 如果函数正在执行，则直接返回
      return;
    }

    this.isAddOrPutPromptsRunning = true;

    while(this.addOrPutPromptsQueue.length > 0){
      const nextPrompt = this.addOrPutPromptsQueue.shift();
      if(nextPrompt===undefined) continue;
      if(nextPrompt.id! <= 0){
        nextPrompt.id = (await this.getMaxId()) + 1;
      }
      await this.dbService.addOrUpdateSystemPrompt(nextPrompt);
    }

    this.isAddOrPutPromptsRunning = false;
  }
  async reLoad() {
    let items = await this.getSystemPrompts();
    if(items===undefined) return;
    this.systemPrompts!.length = 0;
    for (let item of items){
      this.systemPrompts?.push(item);
    }
    this.promptChangeObserver.next(true);
  }


  async deletePrompt(id: number) {
    return this.dbService.deleteSystemPrompt(id);
  }
}
