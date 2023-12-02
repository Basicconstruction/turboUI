import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {NzUploadFile} from "ng-zorro-antd/upload";
import {
  ChatHistoryModel,
  ChatHistoryTitle,
  ChatModel,
  ChatPacket,
  ChatVisionPacket,
  ConfigurationModel,
  FileInChat,
  ImagePacket,
  LastSessionModel,
  Message,
  RequestType,
  ShowType,
  SpeechPacket,
  TranscriptionPacket
} from "../../models";
import {OpenaiService} from "../../fetch";
import {Observable, Observer, Subject, Subscription} from "rxjs";
import {backChatHistorySubject, chatSessionSubject, configurationChangeSubject} from "../../share-datas/datas.module";
import {ChatDataService, ConfigurationService, HistoryTitleService} from "../../share-datas";
import {LastSessionToken} from "../../models/lastSession.model";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.css'
})
export class ChatMainComponent {

  askGPT() {
    if (this.chatHistoryModel === undefined) {
      this.chatHistoryModel = new ChatHistoryModel();
    }
    this.answering = true;
    // 获取当前的请求类型
    let type = this.configurationService.configuration?.requestType!;
    // console.log(type)
    //构建请求文件列表
    let fileList: FileInChat[] | undefined;
    fileList = this.buildFileList();
    // 添加用户请求
    const userRequestShowType = this.getSendMessageType(type);
    const randomId = Date.now()*1000 + Math.floor(Math.random() * 1000) + 1;
    const userModel = new ChatModel("user", this.inputText,
      fileList, randomId,userRequestShowType,true);

    this.chatModels.push(userModel);
    // 如果当前的上下文指针为空，就设置上一条为当前上下文的指针，该指针指示最后一条将要包含到上下文中的对话的id
    if (this.backContextPointer === undefined) {
      this.backContextPointer = userModel.dataId;
    }

    // 构建请求 todo 添加vision的请求包
    let param: ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket
      = this.resolveContext(type);
    // 添加返回的 聊天信息模型
    const model = new ChatModel("assistant");
    model.finish = false;
    this.chatModels.push(model);
    //  构建新的滚动 订阅
    this.scrollSubject = new Subject<boolean>();
    this.scrollSubscribe();
    this.receivedData = '';// 清空接收数据字符串对象
    // 如果当前的聊天历史模型的标题为空，说明使用的是刚创建的，还没有消息，存储到数据库，
    // 设置nextSubjection为true表示将会推送一个新的历史记录
    if (this.chatHistoryModel?.title === '') {
      this.chatHistoryModel.title = this.inputText;
      this.chatHistoryService.putHistoryTitles({
        dataId: this.chatHistoryModel.dataId!,
        title: this.chatHistoryModel.title
      }).then(() => {
        this.nextSubjection = true;
        // 存储标头
      });
    }
    model.showType = this.getPromiseReceiveType(type); // 设置返回模型的展示类型
    this.inputText = '';// 清空输入框
    let subject: Observable<string>;// 构建请求数据
    switch (type) {
      case RequestType.Chat:
        subject = this.openaiService.fetchChat(param as ChatPacket);
        break;
      case RequestType.Image:
        subject = this.openaiService.fetchImage(param as ImagePacket);
        break;
      case RequestType.Speech:
        subject = this.openaiService.fetchTTS(param as SpeechPacket);
        break;
      case RequestType.Transcription:
        subject = this.openaiService.fetchSTT(param as TranscriptionPacket);
        break;
      case RequestType.ChatVision:
        subject = this.openaiService.fetchChatVision(param as ChatVisionPacket);
        break;
    }
    // 订阅返回的数据
    this.subscription = subject!.subscribe({
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
        model.showType = this.getStaticResponseType(type);
        this.finalizeResponse();
      },
      complete: () => {
        this.answering = false;
        model.finish = true;
        model.showType = this.getStaticResponseType(type);
        this.finalizeResponse();
      }
    });
  }


  isBase64Image(fileType: string): boolean {
    return fileType.startsWith("image");
  }
  buildFileList() {
    let res: FileInChat[] = [];
    for (let file of this.fileList) {
      const reader = new FileReader();

      reader.onload = () => {
        let fileContent: string | ArrayBuffer | null = reader.result;
        if(fileContent==null || fileContent instanceof ArrayBuffer){
          return;
        }
        let isImg = this.isBase64Image(file.type!);
        // console.log(file.type)
        let afile: FileInChat = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileContent: isImg? (fileContent as string): ''
        };
        res.push(afile);
      };

      if (file) {
        // @ts-ignore
        reader.readAsDataURL(file as File);
      }
    }
    console.log(res)
    return res;
  }

  finalizeResponse() {
    this.fileList = []  // Todo 需要取消注释，如果不是在调试

    this.scrollSubject?.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.chatDataService.putHistory(this.chatHistoryModel!).then(r => {
      console.log("add database " + r)
      if (this.nextSubjection) {
        this.backHistoryObserver.next({
          dataId: this.chatHistoryModel!.dataId!,
          title: this.chatHistoryModel!.title
        })
        this.nextSubjection = false;
      }
    });
  }

  nextSubscribe(data: boolean) {
    if (this.answering) {
      this.scrollSubject?.next(data);
    }
  }

  scrollSubscribe() {
    this.scrollSubject?.subscribe({
      next: () => {
        this.scrollToBottom();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async typeControlGPT() {
    if (this.answering) {
      return;
    } else {
      this.askGPT();
    }
  }

  async buttonControlGPT() {
    if (this.answering) {
      this.answering = false;
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    } else {
      this.askGPT();
    }
  }

  resolveContext(requestType: RequestType = RequestType.Chat) {
    if (this.chatModels === undefined) {
      console.log("未知错误")
    }
    if (requestType === RequestType.Image) {
      // return new ImagePacket(this.chatModels[this.chatModels.length-1].content);
      return new ImagePacket(this.inputText);
    }
    if (requestType === RequestType.Speech) {
      return new SpeechPacket(this.inputText, this.fileList);
    }
    if (requestType === RequestType.Transcription) {
      if (this.inputText !== '') {
        return new TranscriptionPacket(true, this.fileList, this.inputText);
      } else {
        return new TranscriptionPacket(true, this.fileList);
      }
    }
    if(requestType===RequestType.ChatVision){
      return new ChatVisionPacket([]);// todo
    }
    // normal chat 的上下文处理
    const back = this.backContextPointer!;
    let sessionLength = this.configurationService.configuration?.chatConfiguration.historySessionLength!;
    let messages: Message[] = [];
    const originalArray = [...this.chatModels]; // 创建 chatModels 的副本
    const reversedArray = originalArray.reverse();
    for (let chatModel of reversedArray) {
      if (messages.length >= sessionLength) break;
      if (chatModel.dataId! >= back &&
        (chatModel.showType === ShowType.staticChat
          || chatModel.showType === ShowType.promiseChat
          || chatModel.showType === ShowType.staticChatRequest
        )) {
        // 添加promiseChat是为了容错，避免没有及时的转为静态类型
        messages.splice(0, 0, {
          role: chatModel.role,
          content: chatModel.content
        })
      }
    }
    return new ChatPacket(messages);
  }
  async sync(dataId: number) {
    if (dataId === this.lastSession.sessionId) {
    } else {
      console.log("will open by observer " + dataId)
    }
    try {
      const chatHistory = await this.chatDataService.getChatHistory(dataId);
      if (chatHistory) {
        this.chatHistoryModel = chatHistory;
        console.log("change session")
        this.lastSession.sessionId = dataId;
      } else {
        console.log("not found, create one")
        this.chatHistoryModel = new ChatHistoryModel();
        this.lastSession.sessionId = this.chatHistoryModel.dataId;
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }

  scrollToBottom(): void {
    if (!this.chatPanel) return;
    try {
      this.renderer.setProperty(this.chatPanel.nativeElement, 'scrollTop', this.chatPanel.nativeElement.scrollHeight);
    } catch (err) {
      console.error(err);
    }
  }
  getSendMessageType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChatRequest;
      case RequestType.Image:
        return ShowType.staticImageRequest;
      case RequestType.Speech:
        return ShowType.staticSpeechRequest;
      case RequestType.Transcription:
        return ShowType.staticTranscriptionRequest;
      case RequestType.ChatVision:
        return ShowType.staticVisionRequest;
      default:
        return ShowType.staticChatRequest;
    }
  }
  getPromiseReceiveType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.promiseChat;
      case RequestType.Image:
        return ShowType.promiseImage;
      case RequestType.Speech:
        return ShowType.promiseSpeech;
      case RequestType.Transcription:
        return ShowType.promiseTranscription;
      case RequestType.ChatVision:
        return ShowType.promiseVision;
      default:
        return ShowType.staticChatRequest;
    }
  }
  getStaticResponseType(type: RequestType): ShowType{
    switch (type){
      case RequestType.Chat:
        return ShowType.staticChat;
      case RequestType.Image:
        return ShowType.staticImage;
      case RequestType.Speech:
        return ShowType.staticSpeech;
      case RequestType.Transcription:
        return ShowType.staticTranscription;
      case RequestType.ChatVision:
        return ShowType.staticVision;
      default:
        return ShowType.staticChatRequest;
    }
  }
  constructor(
    private openaiService: OpenaiService,
    private renderer: Renderer2,
    private chatDataService: ChatDataService,
    @Inject(chatSessionSubject) private chatSessionObservable: Observable<number>,
    private chatHistoryService: HistoryTitleService,
    @Inject(backChatHistorySubject) private backHistoryObserver: Observer<ChatHistoryTitle>,
    @Inject(LastSessionToken) private lastSession: LastSessionModel,
    private configurationService: ConfigurationService,
    private notification: NzNotificationService,
    @Inject(configurationChangeSubject) private configurationObserver: Subject<boolean>) {

    this.configurationObserver.subscribe((change)=>{
      if(change){
        // 响应更改
        this.configuration = this.configurationService.configuration!;
      }
    });
    // 初始化configuration
    this.configuration = this.configurationService.configuration!;
    this.chatSessionObservable.subscribe(async (dataId) => {
      await this.sync(dataId).then();
    })
    if (this.chatHistoryModel === undefined && this.lastSession.sessionId) {
      this.sync(this.lastSession.sessionId).then();
    }

  }

  configuration: ConfigurationModel | undefined;
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

  clearContext() {
    this.backContextPointer = undefined;
    this.notification.success("清空上下文", "清除成功")
  }

  enableTouch() {
    // 正在回复 | 没有在回复，内容不为空 |  模型为转录或者tts，且添加了文件
    return this.answering || (!this.answering && this.inputText != '') ||
      ((
        this.configurationService.configuration?.requestType === RequestType.Transcription ||
        this.configurationService.configuration?.requestType === RequestType.Speech
      ) && this.fileList.length > 0);
  }

  isFade() {
    return !this.enableTouch();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
    protected readonly RequestType = RequestType;
}
