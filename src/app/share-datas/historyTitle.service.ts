import {Inject, Injectable} from "@angular/core";
import {Db, DbService} from "./db.service";
import {ChatHistoryTitle} from "../models";

@Injectable()
export class HistoryTitleService{
  constructor( @Inject(Db)private dbService: DbService) {
    // this.init();
  }
  // async init(){
  //   this.historyTitles = await this.dbService.getHistoryTitles();
  // }
  async getHistoryTitles(){
    return await this.dbService.getHistoryTitles();
  }
  async putHistoryTitles(historyTitles: ChatHistoryTitle){
    return await this.dbService.addOrUpdateHistoryTitles(historyTitles);
  }

  // historyTitles: ChatHistoryTitle[] | undefined;
}
