import {Injectable} from "@angular/core";
import {SystemInfo} from "../models";
import {DbService} from "./db.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SystemInfoService{
  public systemInfoList: SystemInfo[] | undefined;
  private initFinish = false;
  constructor(private dbService: DbService
              ) {
    this.Init();
  }
  public async Init(){
    this.systemInfoList = [];
    this.initFinish = true;
    this.waitForInit().then(async () => {
      this.getSystemInfoList().then((systemInfoList) => {
        if (systemInfoList !== undefined) {
          this.systemInfoList!.length = 0;
          for(let info of systemInfoList){
            this.systemInfoList?.push(info)
          }
        }
      });
    });
  }
  private waitForInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.dbService.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.dbService.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, 10);
      }
    });
  }
  public async accept() {
    if (this.systemInfoList !== undefined) {
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
        }, 10);
      }
    });
  }

  private getSystemInfoList():Promise<SystemInfo[] | undefined> {
    return this.dbService.getSystemInfoList();
  }
}
