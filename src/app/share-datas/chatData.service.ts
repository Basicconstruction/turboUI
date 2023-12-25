import {Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {ChatHistory, ChatHistoryModel, ChatListModel, ChatModel} from "../models";
import {DatasModule} from "./datas.module";

@Injectable({
  providedIn: DatasModule
})
export class ChatDataService{
  constructor(private dbService: DbService) {

  }
  async getChatHistory(dataId: number): Promise<ChatHistoryModel | undefined> {
    try {
      const data = await this.dbService.getHistory(dataId);
      if(!data) return undefined;
      let list = (data!.chatList.map(async (chatModelId) => {
        let chatInterface = await this.dbService.getChatInterface(chatModelId);
        if(chatInterface === undefined) return undefined;
        return new ChatModel(
          chatInterface.role,
          chatInterface.content,
          chatInterface.fileList,
          chatInterface.dataId,
          chatInterface.showType,
          true,
          chatInterface.model
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
    } catch (error) {
      // Handle errors, log or throw if necessary
      console.error('Error fetching chat history:', error);
      throw error; // Propagate the error or handle it according to your needs
    }
  }
  async deleteHistoriesByTitleId(titleId: number){
    try{
      const data = await this.dbService.getHistory(titleId);
      if(!data) return undefined;
      data!.chatList.map(async (chatModelId) => {
        await this.dbService.deleteChatInterface(chatModelId);
      });
      await this.dbService.deleteHistory(titleId);
    }catch (error){

    }
  }
  async putHistory(history: ChatHistoryModel){
    if(!history) return;
    let chatList = history.chatList!.chatModel!.map(async h => {
      const chat = h;
      let exist = await this.dbService.checkChatModelExists(chat.dataId!);
      if(exist&& !chat.markAsChanged){
        // 已经存在并且没有被标记为已经更改
        return chat.dataId;
      }else{
        await this.dbService.putChatInterface({
          role: chat.role,
          content: chat.content,
          fileList: chat.fileList,
          dataId: chat.dataId!,
          showType: chat.showType,
          finish: true,
          model: chat.model
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


  deleteChatModel(id: number) {
    return this.dbService.deleteChatInterface(id);
  }
}
