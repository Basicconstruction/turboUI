import {Injectable} from "@angular/core";
import {DBSchema, IDBPDatabase, openDB} from "idb";
import {ChatHistory, ChatHistoryTitle, Configuration} from "../models";
import {CONFIGURATION} from "../models/configuration.interface";
import {ChatInterface} from "../models";
@Injectable({
  providedIn: "root"
})
export class DbService{
  private idbDb: IDBPDatabase<ChatDb> | undefined;
  public initFinish = false;
  constructor() {
    this.initDb().then(
      ()=>this.initFinish = true
    );
  }
  async initDb(){
    this.idbDb = await openDB('chatDb-v1', 2, {
      upgrade(db) {
        // 删除所有旧版本的数据（与本版本有关联的数据表）
        if (db.objectStoreNames.contains("chatHistories")) {
          db.deleteObjectStore("chatHistories");
        }
        db.createObjectStore("chatHistories",
          { keyPath: 'dataId'});

        if (db.objectStoreNames.contains("chatHistoryTitles")) {
          db.deleteObjectStore("chatHistoryTitles");
        }
        db.createObjectStore("chatHistoryTitles",
          { keyPath: 'dataId' });

        if (db.objectStoreNames.contains("configuration")) {
          db.deleteObjectStore("configuration")
        }
        db.createObjectStore("configuration")

        if(db.objectStoreNames.contains("chatInterface")){
          db.deleteObjectStore("chatInterface")
        }
        db.createObjectStore("chatInterface",{
          keyPath: 'dataId'
        })
      },
    });
  }
  async checkChatModelExists(dataId: number){
    const tx = this.idbDb?.transaction('chatInterface', 'readonly');
    if(!tx){
      return false;
    }
    const store = tx.objectStore("chatInterface");
    return await store.count(dataId) === 1;
  }
  async putChatInterface(chat: ChatInterface){
    return this.idbDb?.put("chatInterface",chat);
  }
  async deleteChatInterface(dataId: number){
    return this.idbDb?.delete("chatInterface",dataId);
  }
  async getChatInterface(dataId: number){
    return this.idbDb?.get("chatInterface",dataId);
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
  async setConfiguration(configuration: Configuration) {
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
  chatInterface:{
    key: number,
    value: ChatInterface
  }
}
