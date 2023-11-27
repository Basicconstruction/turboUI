import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {NzUploadFile} from "ng-zorro-antd/upload";
import {ChatHistoryTitle, ChatModel, LastSessionModel} from "../../models";
import {OpenaiService} from "../../fetch";
import {Observable, Observer, Subject, Subscription} from "rxjs";
import {backChatHistorySubject, chatSessionSubject} from "../../share-datas/datas.module";
import {ChatDataService, HistoryTitleService} from "../../share-datas";
import {ChatHistoryModel} from "../../models/chatHistory.model";
import {Message} from "../../models/message.model";
import {ConfigurationService} from "../../share-datas/configuration.service";
import {GPTType} from "../../models/chat.interface";
import {LastSessionToken} from "../../models/lastSession.model";
import {NzNotificationService} from "ng-zorro-antd/notification";
@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.css'
})
export class ChatMainComponent {
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  fileList: NzUploadFile[] = [];
  inputText: string = '';
  scrollSubject: Subject<boolean> | undefined;
  private _chatHistoryModel: ChatHistoryModel | undefined;

  get chatHistoryModel(): ChatHistoryModel | undefined {
    return this._chatHistoryModel;
  }

  set chatHistoryModel(value: ChatHistoryModel | undefined) {
    this._chatHistoryModel = value;
    this.chatModels = this._chatHistoryModel?.chatList?.chatModel!;
  }
  chatModels: ChatModel[] = [];
  answering: boolean = false;
  nextSubjection: boolean = false;
  receivedData: string = '';
  subscription: Subscription | undefined;
  backContextPointer: number | undefined;
  @ViewChild('chatPanel') private chatPanel: ElementRef | undefined;
  constructor(
    private openaiService: OpenaiService,
    private renderer: Renderer2,
    private chatDataService: ChatDataService,
    @Inject(chatSessionSubject) private chatSessionObservable: Observable<number>,
    private chatHistoryService: HistoryTitleService,
    @Inject(backChatHistorySubject) private backHistoryObserver: Observer<ChatHistoryTitle>,
    @Inject(LastSessionToken) private lastSession: LastSessionModel,
    private configurationService: ConfigurationService,
    private notification: NzNotificationService
    ) {
    this.chatSessionObservable.subscribe(async (dataId) => {
      await this.sync(dataId).then();
    })
    if(this.chatHistoryModel===undefined&&this.lastSession.sessionId){
      this.sync(this.lastSession.sessionId).then();
    }

  }
  async sync(dataId: number){
    // console.log(this.lastSession.sessionId+" "+dataId)
    if(dataId===this.lastSession.sessionId){
      // console.log("no need to update")//&&dataId==this.chatHistoryModel?.dataId
      // return;
    }else{
      console.log("will open by observer "+dataId)
    }
    try {
      const chatHistory = await this.chatDataService.getChatHistory(dataId);
      if(chatHistory){
        this.chatHistoryModel = chatHistory;
        console.log("change session")
        this.lastSession.sessionId = dataId;
      }else{
        console.log("not found, create one")
        this.chatHistoryModel = new ChatHistoryModel();
        this.lastSession.sessionId = this.chatHistoryModel.dataId;
        // this.chatModels.push(...this.oldChatModels);
        // console.log("test new session")
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  scrollToBottom(): void {
    if(!this.chatPanel) return;
    try {
      this.renderer.setProperty(this.chatPanel.nativeElement, 'scrollTop', this.chatPanel.nativeElement.scrollHeight);
    } catch (err) {
      console.error(err);
    }
  }
  askGPT() {
    if(this.chatHistoryModel===undefined){
      this.chatHistoryModel = new ChatHistoryModel();
    }
    this.answering = true;
    const userModel = new ChatModel("user",this.inputText);
    this.chatModels.push(userModel);
    if(this.backContextPointer===undefined){
      this.backContextPointer = userModel.dataId;
    }
    let type = this.configurationService.configuration?.type!;
    let param: Message[] | string = this.resolveContext(type);
    const model = new ChatModel("assistant");
    model.finish = false;
    this.chatModels.push(model);
    this.scrollSubject = new Subject<boolean>();
    this.scrollSubscribe();
    this.receivedData = '';
    if(this.chatHistoryModel?.title===''){
      this.chatHistoryModel.title = this.inputText;
      this.chatHistoryService.putHistoryTitles({
        dataId: this.chatHistoryModel.dataId!,
        title: this.chatHistoryModel.title
      }).then(()=>{
        this.nextSubjection = true;
        // 存储标头
      });
    }

    model.type = type;
    this.inputText = '';
    this.subscription = this.openaiService.fetchData(param,type).subscribe({
    next: (data: any) => {
      this.receivedData += data;
      model.content = this.receivedData;
      this.nextSubscribe(true);
    },
    error: (error: any) => {
      console.error('Error fetching data:', error);
      model.content += `网络可能遇到了问题`;
      model.finish = true;
      this.nextSubscribe(false);

      this.answering = false;
      this.scrollSubject?.complete();
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.chatDataService.putHistory(this.chatHistoryModel!).then(r => {
        console.log("add database "+r)
        if(this.nextSubjection){
          this.backHistoryObserver.next({
            dataId: this.chatHistoryModel!.dataId!,
            title: this.chatHistoryModel!.title
          })
          this.nextSubjection = false;
        }
      });// 更新数据
      // 更新 chat-page 的历史

    },
      complete:()=>{
        this.answering = false;
        model.finish = true;
        this.scrollSubject?.complete();
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.chatDataService.putHistory(this.chatHistoryModel!).then(r => {
          console.log("add database "+r)
          if(this.nextSubjection){
            this.backHistoryObserver.next({
              dataId: this.chatHistoryModel!.dataId!,
              title: this.chatHistoryModel!.title
            })
            this.nextSubjection = false;
          }
        });// 更新数据
        // 更新 chat-page 的历史

      }
    });
  }
  nextSubscribe(data: boolean){
    if(this.answering){
      this.scrollSubject?.next(data);
    }
  }
  scrollSubscribe(){
    this.scrollSubject?.subscribe({
      next: (data: boolean)=>{
        this.scrollToBottom();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  async typeControlGPT(){
    if(this.answering){
      return;
    }else{
      this.askGPT();
    }
  }
  async buttonControlGPT(){
    // this.chatHistoryModel?.chatList!.chatModel?.push(new ChatModel('user',
    //   '[{"revised_prompt": "Prompt", "url": "image-url", "b64_json": "base64"}]' ,8,GPTType.Image))
    //
    // await this.chatDataService.putHistory(this.chatHistoryModel!)
    if(this.answering){
      this.answering = false;
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }else{
      this.askGPT();
    }
  }
  // chatModels: ChatModel[],backContextPointer: number | undefined
  resolveContext(type: GPTType = GPTType.ChatStream): Message[] | string{
    if(this.chatModels===undefined){
      console.log("未知错误")
    }
    if(type===GPTType.Image){
      return this.chatModels[this.chatModels.length-1].content;
    }
    const back = this.backContextPointer!;
    let sessionLength = this.configurationService.configuration?.chatConfiguration.historySessionLength!;
    let messages: Message[] = [];
    const originalArray = [...this.chatModels]; // 创建 chatModels 的副本
    const reversedArray = originalArray.reverse();
    for(let chatModel of reversedArray){
      if(messages.length>=sessionLength) break;
      if(chatModel.dataId!>=back&&chatModel.type===GPTType.ChatStream){
        messages.splice(0,0,{
          role: chatModel.role,
          content: chatModel.content
        })
      }
    }
    return messages;
  }

  clearContext() {
    this.backContextPointer = undefined;
    this.notification.success("清空上下文","清除成功")
  }
}
