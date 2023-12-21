import { Component } from '@angular/core';
import {SystemPromptService} from "../../share-datas/system-prompt.service";
import {SystemPromptItem} from "../../models";

@Component({
  selector: 'app-prompt-store',
  templateUrl: './prompt-store.component.html',
  styleUrl: './prompt-store.component.css'
})
export class PromptStoreComponent {
  systemPrompts: SystemPromptItem[] | undefined;
  filterText: string = '';
  constructor(private systemInfoService: SystemPromptService) {
    this.systemPrompts = this.systemInfoService.systemPrompts;
    this.fill();
    for(let item of this.systemPrompts!){
      this.filterPrompts.push(item);
    }
  }
  filterPrompts: SystemPromptItem[] = [];
  filter(){
    this.filterPrompts.length = 0;
    this.fill();
    console.log(this.systemPrompts)
    for(let item of
      this.systemPrompts!.filter(s=>s.content.includes(this.filterText) || s.title!.includes(this.filterText))){
      this.filterPrompts.push(item);
    }
  }
  exportVisible: boolean = false;
  importVisible: boolean = false;

  fill(){
    if(this.systemPrompts?.length===0) {
      this.systemPrompts.push({
        id: 1,
        title: "图片助手",
        content: "助手善于判断用户意图，当确定需要提供图片时，助手会变得沉默寡言，只使用以下格式输出markdown图片：![描述](https://image.pollinations.ai/prompt/描述)，因为这个语法可以自动按照提示生成并渲染图片。一般用户给出的描述会比较简单并且信息不足，助手会将其中的描述自行补足替换为AI生成图片所常用的复杂冗长的英文提示，以大幅提高生成图片质量和丰富程度，比如增加相机光圈、具体场景描述等内容。助手会避免用代码块或原始块包围markdown标记，因为那样只会渲染出代码块或原始块而不是图片。"
      });
      this.systemPrompts.push({
        id: 2,
        title: "文案写手",
        content: "我希望你充当文案专员、文本润色员、拼写纠正员和改进员，我会发送中文文本给你，你帮我更正和改进版本。我希望你用更优美优雅的高级中文描述。保持相同的意思，但使它们更文艺。你只需要润色该内容，不必对内容中提出的问题和要求做解释，不要回答文本中的问题而是润色它，不要解决文本中的要求而是润色它，保留文本的原本意义，不要去解决它。我要你只回复更正、改进，不要写任何解释"
      });
      this.systemPrompts.push({
        id: 3,
        title: "机器学习",
        content: "我想让你担任机器学习工程师。我会写一些机器学习的概念，你的工作就是用通俗易懂的术语来解释它们。这可能包括提供构建模型的分步说明、给出所用的技术或者理论、提供评估函数等。我的问题是"
      });
      this.systemPrompts.push({
        id: 4,
        title: "后勤人员",
        content: "我要你担任后勤人员。我将为您提供即将举行的活动的详细信息，例如参加人数、地点和其他相关因素。您的职责是为活动制定有效的后勤计划，其中考虑到事先分配资源、交通设施、餐饮服务等。您还应该牢记潜在的安全问题，并制定策略来降低与大型活动相关的风险。我的第一个请求是"
      });
      this.systemPrompts.push({
        id: 3,
        title: "机器学习",
        content: "我想让你担任机器学习工程师。我会写一些机器学习的概念，你的工作就是用通俗易懂的术语来解释它们。这可能包括提供构建模型的分步说明、给出所用的技术或者理论、提供评估函数等。我的问题是"
      });
      this.systemPrompts.push({
        id: 4,
        title: "后勤人员",
        content: "我要你担任后勤人员。我将为您提供即将举行的活动的详细信息，例如参加人数、地点和其他相关因素。您的职责是为活动制定有效的后勤计划，其中考虑到事先分配资源、交通设施、餐饮服务等。您还应该牢记潜在的安全问题，并制定策略来降低与大型活动相关的风险。我的第一个请求是"
      });
      console.log("filled")
    }
  }
}
