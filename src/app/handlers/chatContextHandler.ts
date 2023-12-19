import {Injectable} from "@angular/core";
import {ChatModel, Configuration, Message, ShowType} from "../models";

@Injectable({
  providedIn: "root"
})
export class ChatContextHandler{
  handler(back: number | undefined,
          configuration: Configuration,
          chatModels: ChatModel[],
          endPointer: number | undefined): Message[]{
    let sessionLength = configuration?.chatConfiguration.historySessionLength!;
    let messages: Message[] = [];
    const originalArray = [...chatModels]; // 创建 chatModels 的副本
    const reversedArray = originalArray.reverse();
    for (let chatModel of reversedArray) {
      if (messages.length >= sessionLength) break;
      if(endPointer!==undefined && chatModel.dataId!>endPointer!){
        // 如果传递了 结束指针，就跳过结束指针之后的聊天模型对象
        continue;
      }
      if (chatModel.dataId! >= back! &&
        (chatModel.showType === ShowType.staticChat
          || chatModel.showType === ShowType.promiseChat
          || chatModel.showType === ShowType.staticChatRequest
          || chatModel.showType === ShowType.staticVision
          || chatModel.showType === ShowType.staticVisionRequest
          || chatModel.showType === ShowType.promiseVision
        )) {
        // 添加promiseChat是为了容错，避免没有及时的转为静态类型
        messages.splice(0, 0, {
          role: chatModel.role,
          content: chatModel.content
        })
      }
    }
    return messages;
  }
}
