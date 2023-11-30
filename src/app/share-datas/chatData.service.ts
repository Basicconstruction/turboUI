import {Inject, Injectable} from "@angular/core";
import {Db, DbService} from "./db.service";
import {Chat, ChatHistoryModel, ChatListModel, ChatModel, ImageList} from "../models";

import {GPTType} from "../models/GPTType";

@Injectable()
export class ChatDataService{
  constructor(@Inject(Db) private dbService: DbService) {

  }
  async getChatHistory(dataId: number): Promise<ChatHistoryModel | undefined> {
    try {
      const data = await this.dbService.getHistory(dataId);
      if(!data) return undefined;
      let list = (data!.chatList.map(async (c) => {
        if (c.type === GPTType.ChatStream || c.type === GPTType.Speech || c.type === GPTType.Transcriptions) {
          return new ChatModel(c.role, c.content, c.dataId, c.type);
        } else if(c.type===GPTType.Image){
          let content = JSON.stringify(await this.dbService.getImage(c.dataId!));
          return new ChatModel(c.role, content, c.dataId, c.type);
        }else{
          return new ChatModel(c.role, c.content, c.dataId, c.type);
        }
      }));

      return await Promise.all(list).then(chatModels=>{
        return new ChatHistoryModel(
          data.title,
          new ChatListModel(
            data.dataId,
            chatModels
          ),
          data.dataId
        );
      })
      // return undefined;
    } catch (error) {
      // Handle errors, log or throw if necessary
      console.error('Error fetching chat history:', error);
      throw error; // Propagate the error or handle it according to your needs
    }
  }
  async putHistory(history: ChatHistoryModel){
    if(!history) return;
    let chatList = history.chatList!.chatModel!.map(async h => {
      if (h.type === GPTType.ChatStream || h.type === GPTType.Speech || h.type === GPTType.Transcriptions) {
        return {
          dataId: h.dataId!,
          role: h.role,
          content: h.content,
          type: h.type
        }
      } else if(h.type===GPTType.Image){
        let imageList: ImageList = JSON.parse(h.content);
        imageList.dataId = h.dataId!;
        let add = await this.dbService.addOrUpdateImage(imageList);
        return {
          dataId: h.dataId!,
          role: h.role,
          content: '',
          type: h.type
        }
      }else{// 其他的 请求，不希望这些影响上下文
        return {
          dataId: h.dataId!,
          role: h.role,
          content: h.content,
          type: h.type
        }
      }
    });
    return await Promise.all(chatList)
      .then(async (completedChatList: Chat[]) => {
        try {
          return await this.dbService.addOrUpdateHistory({
            title: history.title,
            dataId: history.dataId!,
            chatList: completedChatList!
          });
        } catch (e) {
          console.log(e)
          return 1;
          // throw e;
        }
      })
      .catch((error) => {
        // 处理错误
        console.error("An error occurred:", error);
      });

  }


}
