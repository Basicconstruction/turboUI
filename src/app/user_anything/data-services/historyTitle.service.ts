import {Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {DatasModule} from "./datas.module";
import {ChatHistoryTitle} from "../models";

@Injectable({
  providedIn: DatasModule
})
export class HistoryTitleService{
  constructor(private dbService: DbService) {

  }
  async getHistoryTitles(){
    return await this.dbService.getHistoryTitles();
  }
  async putHistoryTitles(historyTitle: ChatHistoryTitle){
    return await this.dbService.addOrUpdateHistoryTitles(historyTitle);
  }
  async deleteHistoryTitle(historyTitle: ChatHistoryTitle){
    return await this.dbService.deleteHistoryTitles(historyTitle.dataId);
  }
}
