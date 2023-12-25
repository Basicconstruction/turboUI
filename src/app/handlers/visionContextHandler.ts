import {Injectable} from "@angular/core";
import {ChatModel, Configuration, ShowType, VisionMessage} from "../models";
import {ImageContent, TextContent} from "../models/message.model";
import {ChatContext, SystemContext} from "../services";
import {SystemRole} from "../models";

@Injectable()
export class VisionContextHandler{
  handlerBefore(chatContext: ChatContext,
                chatModels: ChatModel[],
                messages: VisionMessage[]){
    let systemMs = chatContext.systems!;
    let ignores: SystemContext[] = systemMs;
    if(chatContext.pointer!==undefined){
      ignores = systemMs.filter(ms=>ms.id < chatContext.pointer! && ms.in);
    }
    for (let ms of ignores){
      let chatModel = chatModels.find(m=>m.dataId===ms.id);
      if(chatModel!==undefined){
        messages.splice(0,0,
          {
            role: SystemRole,
            content: [
              {
                type: "text",
                text: chatModel.content
              }
            ],
          }
        );
      }
    }
  }
  handler(back: number | undefined,
          configuration: Configuration,
          chatModels: ChatModel[],
          endPointer: number | undefined
          ): VisionMessage[]{
    let sessionLength = configuration?.chatConfiguration.historySessionLength!;
    let messages: VisionMessage[] = [];
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
        let content: (TextContent | ImageContent)[] = [];
        if(chatModel.showType === ShowType.staticVision
          || chatModel.showType === ShowType.staticVisionRequest
          || chatModel.showType === ShowType.promiseVision){
          content.push({
            type: "text",
            text: chatModel.content
          });
          const detail = configuration?.chatConfiguration.detail;
          chatModel.fileList?.forEach(file=>{
            content.push({
              type: "image_url",
              image_url: {
                url: file.fileContent!,
                detail: detail
              }
            })
          })
        }else{
          content.push({
            type: "text",
            text: chatModel.content
          });
        }
        messages.splice(0, 0, {
          role: chatModel.role,
          content: content
        })
      }
    }
    return messages;
  }
}
