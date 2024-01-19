import {ChatListModel} from "./chatList.model";

export class ChatHistoryModel{
  constructor(public title:string='',public chatList?: ChatListModel,public dataId?: number) {
    if(this.dataId==null){
      this.dataId = Date.now() * 1000 + Math.floor(Math.random() * 1000) + 1;
    }
    if(this.chatList==null){
      this.chatList = new ChatListModel(this.dataId!);
    }
  }
}
