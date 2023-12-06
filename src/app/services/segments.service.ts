import {Injectable} from "@angular/core";
import {ChatModel} from "../models";

@Injectable()
export class SegmentsService{
  segmentsChat(chatModel: ChatModel | undefined){
    if (!chatModel) return;
    const segments: { content: string, isCode: boolean }[] = [];
    const regex = /```([\s\S]*?)```/g; // 修改了正则表达式以匹配多行内容
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(chatModel.content)) !== null) {
      const codeStartIndex = match.index;
      const codeEndIndex = regex.lastIndex;
      const precedingText = chatModel.content.substring(lastIndex, codeStartIndex);
      if (precedingText.trim().length > 0) {
        segments.push({ content: precedingText, isCode: false });
      }
      const codeContent = match[1];
      segments.push({ content: codeContent, isCode: true });
      lastIndex = codeEndIndex;
    }

    const remainingText = chatModel.content.substring(lastIndex);
    if (remainingText.trim().length > 0) {
      segments.push({ content: remainingText, isCode: false });
    }
    // console.log(segments);
    return  segments;

  }
}
