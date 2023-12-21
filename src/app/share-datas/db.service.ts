import {Injectable} from "@angular/core";
import {DBSchema, IDBPDatabase, openDB} from "idb";
import {ChatHistory, ChatHistoryTitle, Configuration, SystemPromptItem} from "../models";
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
    this.idbDb = await openDB('chatDb-v1', 4, {
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
        });
        if(db.objectStoreNames.contains("systemPrompt")){
          db.deleteObjectStore("systemPrompt");
        }
        db.createObjectStore("systemPrompt",{
          keyPath: "id"
        });
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

  async getSystemPrompts(){
    return this.idbDb?.getAll("systemPrompt");
  }
  async addOrUpdateSystemPrompt(systemPromptItem: SystemPromptItem){
    return this.idbDb?.put("systemPrompt",systemPromptItem);
  }
  async deleteSystemPrompt(id: number){
    return this.idbDb?.delete("systemPrompt",id);
  }
  async getMaxPromptId(){
    let prompts = await this.getSystemPrompts();
    if(prompts===undefined){
      return 1;
    }
    let id = 1;
    for(let prompt of prompts!) {
      if (prompt.id! > id) {
        id = prompt.id!;
      }
    }
    return id;
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
  },
  systemPrompt:{
    key: number;
    value: SystemPromptItem;
  }
}
