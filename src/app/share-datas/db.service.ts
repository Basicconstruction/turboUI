import {Injectable, InjectionToken} from "@angular/core";
import {DBSchema, IDBPDatabase, openDB} from "idb";
import {ChatHistory, ChatHistoryTitle, Configuration, ConfigurationModel} from "../models";
import {CONFIGURATION, GPTType, ImageList} from "../models/chat.interface";
export const Db = new InjectionToken("db-service");
@Injectable()
export class DbService{
  private idbDb: IDBPDatabase<ChatDb> | undefined;
  public initFinish = false;
  constructor() {
    this.initDb().then(
      ()=>this.initFinish = true
    );
    // 没有检查
  }
  async initDb(){
    this.idbDb = await openDB('chatDb-v1', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("chatHistories")) {
          db.createObjectStore("chatHistories",
            { keyPath: 'dataId'});
        }
        if (!db.objectStoreNames.contains("chatHistoryTitles")) {
          db.createObjectStore("chatHistoryTitles",
            { keyPath: 'dataId' });
        }
        if (!db.objectStoreNames.contains("configuration")) {
          db.createObjectStore("configuration")
        }
        if(!db.objectStoreNames.contains("chatImage")){
          db.createObjectStore("chatImage",{
            keyPath: 'dataId'
          })
        }
      },
    });
  }
  async getImage(dataId: number){
    return this.idbDb?.get("chatImage",dataId);
  }
  async addOrUpdateImage(imageList: ImageList){
    return this.idbDb?.put("chatImage",imageList)
  }
  async deleteImage(dataId: number){
    return this.idbDb?.delete("chatImage",dataId);
  }
  async getHistoryTitles(){
    return this.idbDb?.getAll('chatHistoryTitles');
  }
  async deleteHistoryTitles(dataId: number){
    return this.idbDb?.delete('chatHistoryTitles',dataId);
  }
  async addOrUpdateHistoryTitles(historyTitle: ChatHistoryTitle){
    return this.idbDb?.put("chatHistoryTitles",historyTitle);
  }
  // 获取单个 ChatHistory
  async getHistory(dataId: number) {
    return this.idbDb?.get('chatHistories', dataId);
  }

  // 删除单个 ChatHistory
  async deleteHistory(dataId: number) {
    return this.idbDb?.delete('chatHistories', dataId);
  }

  // 添加或更新单个 ChatHistory
  async addOrUpdateHistory(history: ChatHistory) {
    return this.idbDb?.put('chatHistories', history);
  }

  // 读取 Configuration
  async getConfiguration() {
    return this.idbDb?.get('configuration', CONFIGURATION);
  }

// 存储 Configuration
  async setConfiguration(configuration: ConfigurationModel) {
    return this.idbDb?.put('configuration', configuration,CONFIGURATION);
  }


}

interface ChatDb extends DBSchema{
  chatHistories:{
    key: number,
    value: ChatHistory,
  },
  chatHistoryTitles:{
    key: number,
    value: ChatHistoryTitle,
  },
  configuration:{
    key: string,
    value: Configuration,
  },
  chatImage:{
    key: number,
    value: ImageList
  }
}
