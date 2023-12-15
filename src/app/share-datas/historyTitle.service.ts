import {Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {ChatHistoryTitle} from "../models";

@Injectable({
  providedIn: "root"
})
export class HistoryTitleService{
  constructor(private dbService: DbService) {

  }
  async getHistoryTitles(){
    return await this.dbService.getHistoryTitles();
  }
  async putHistoryTitles(historyTitles: ChatHistoryTitle){
    return await this.dbService.addOrUpdateHistoryTitles(historyTitles);
  }
}
