import {ChatModel} from "./chat.model";

export class ChatListModel{
  constructor(public dateId: number,public chatModel?: ChatModel[]) {
    if(this.chatModel==null){
      this.chatModel = []
    }
  }
}
