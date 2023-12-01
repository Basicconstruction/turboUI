import {Inject, Injectable} from "@angular/core";
import {Db, DbService} from "./db.service";
import {ChatHistory, ChatHistoryModel, ChatListModel, ChatModel} from "../models";

@Injectable()
export class ChatDataService{
  constructor(@Inject(Db) private dbService: DbService) {

  }
  async getChatHistory(dataId: number): Promise<ChatHistoryModel | undefined> {
    try {
      const data = await this.dbService.getHistory(dataId);
      if(!data) return undefined;
      let list = (data!.chatList.map(async (c) => {
        const id = c;
        let chatInterface = await this.dbService.getChatInterface(id);
        if(chatInterface === undefined) return undefined;
        return new ChatModel(
          chatInterface.role,
          chatInterface.content,
          chatInterface.fileList,
          chatInterface.dataId,
          chatInterface.type,
          chatInterface.finish
        )
      }));

      return await Promise.all(list).then(chatModels=>{
        const list: ChatModel[] = chatModels.filter(d => d !== undefined) as ChatModel[];
        return new ChatHistoryModel(
          data.title,
          new ChatListModel(
            data.dataId,
            list
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
      const chat = h;
      let exist = await this.dbService.checkChatModelExists(chat.dataId!);
      if(exist){
        return chat.dataId;
      }else{
        await this.dbService.putChatInterface({
          role: chat.role,
          content: chat.content,
          fileList: chat.fileList,
          dataId: chat.dataId!,
          type: chat.type,
          finish: chat.finish
        });
        return chat.dataId;
      }
    });
    return await Promise.all(chatList)
      .then(async (completedChatList) => {
        try {
          return await this.dbService.addOrUpdateHistory(<ChatHistory>{
            title: history.title,
            dataId: history.dataId!,
            chatList: completedChatList
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
