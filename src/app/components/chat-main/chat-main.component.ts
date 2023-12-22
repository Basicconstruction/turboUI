import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {NzUploadFile} from "ng-zorro-antd/upload";
import {
  ChatHistoryModel, ChatHistoryTitle, ChatModel, ChatPacket, ChatVisionPacket,
  Configuration, FileInChat, ImagePacket, LastSessionModel, RequestType, SpeechPacket,
  SystemPromptItem, TaskType, TranscriptionPacket, UserTask,
} from "../../models";
import {Observable, Observer, Subject, Subscription} from "rxjs";
import {backChatHistorySubject, chatSessionSubject, configurationChangeSubject} from "../../share-datas/datas.module";
import {ChatDataService, ConfigurationService, HistoryTitleService} from "../../share-datas";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ContextMemoryService, SidebarService, SizeReportService} from "../../services";
import {ShowTypeService} from "../../services";
import {ModelFetchService} from "../../services";
import {ChatContextHandler, VisionContextHandler} from "../../handlers";
import {AssistantRole, SystemRole, UserRole} from "../../models";
import {ChatContext, SystemContext} from "../../services";
@Component({
  selector: 'app-chat-main',
  templateUrl: './chat-main.component.html',
  styleUrl: './chat-main.component.css'
})
export class ChatMainComponent {

  async askGPT() {
    if (this.chatHistoryModel === undefined) {
      this.chatHistoryModel = new ChatHistoryModel();
    }
    this.answering = true;
    // 获取当前的请求类型
    let currentRequestModelType = this.configurationService.configuration?.requestType!;
    //构建请求文件列表
    await this.buildFileList();

    // 添加用户请求
    const userRequestShowType = this.showTypeService.getSendMessageType(currentRequestModelType);
    const randomId = Date.now()*1000 + Math.floor(Math.random() * 500) + 1;
    const userModel = new ChatModel("user", this.inputText,
      this.chatFileList, randomId,userRequestShowType,true,this.configuration!.model);
    this.chatModels.push(userModel);
    // 如果当前的上下文指针为空，就设置上一条为当前上下文的指针，该指针指示最后一条将要包含到上下文中的对话的id
    if (this.chatContext.pointer === undefined) {
      this.chatContext.pointer = userModel.dataId;
      this.awareContextChange();
    }

    let fetchParam: ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket
      = this.resolveContext(currentRequestModelType,this.chatContext.pointer,undefined);
    // 添加返回的 聊天信息模型
    const assistantModel = new ChatModel(AssistantRole);
    assistantModel.finish = false;
    assistantModel.reRandom();
    assistantModel.model = this.configuration!.model;
    this.chatModels.push(assistantModel);
    //  构建新的滚动 订阅
    this.scrollSubject = new Subject<boolean>();
    this.scrollSubscribe();
    this.nextSubscribe(true);
    // 如果当前的聊天历史模型的标题为空，说明使用的是刚创建的，还没有消息，存储到数据库，
    // 设置nextSubjection为true表示将会推送一个新的历史记录
    this.handleTitleWhenNewResponse();
    assistantModel.showType = this.showTypeService.getPromiseReceiveType(currentRequestModelType); // 设置返回模型的展示类型
    this.inputText = '';// 清空输入框
    let response: Observable<string> = this.modelFetchService.getFetchResponse(currentRequestModelType,fetchParam);
    // 订阅返回的数据
    this.animalModel = assistantModel;
    this.responseSubscription = this.subscriptionResponse(response,assistantModel,currentRequestModelType);
  }
  handleTitleWhenNewResponse(){
    if (this.chatHistoryModel?.title === '') {
      if(this.inputText===''){
        if(this.chatFileList.length>=1){
          this.chatHistoryModel.title = this.chatFileList[0].fileName.substring(0,25);
        }else{
          this.chatHistoryModel.title = "哪里出现了问题";
        }
      }else{
        this.chatHistoryModel.title = this.inputText.substring(0,25);
      }
      this.chatHistoryService.putHistoryTitles({
        dataId: this.chatHistoryModel.dataId!,
        title: this.chatHistoryModel.title
      }).then(()=>{

      })
      this.notifyChatHistoryIdentifier = true;
    }
  }
  subscriptionResponse(subject: Observable<string>, model: ChatModel,type: RequestType): Subscription{
    let collector = '';
    return subject!.subscribe({
      next: (data: any) => {
        collector += data;
        model.content = collector;
        this.nextSubscribe(true);
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        model.content += `网络可能遇到了问题`;
        model.finish = true;
        this.nextSubscribe(false);
        this.answering = false;
        model.showType = this.showTypeService.getStaticResponseType(type);
        this.finalizeResponse();
      },
      complete: () => {
        this.answering = false;
        model.finish = true;
        model.showType = this.showTypeService.getStaticResponseType(type);
        this.finalizeResponse();
      }
    });
  }

  // 一个相应的生命周期的结束，清空 文件列表，结束滚动订阅
  //
  finalizeResponse() {
    this.fileList = []
    this.chatFileList = []

    this.scrollSubject?.complete();
    if (this.responseSubscription&&!this.responseSubscription.closed) {
      if(this.animalModel){
        this.animalModel.finish = true;
      }
      this.responseSubscription.unsubscribe();
    }
    this.chatDataService.putHistory(this.chatHistoryModel!).then(() => {
      if (this.notifyChatHistoryIdentifier) {
        this.backHistoryObserver.next({
          dataId: this.chatHistoryModel!.dataId!,
          title: this.chatHistoryModel!.title
        })
        this.notifyChatHistoryIdentifier = false;
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
    if (this.responseSubscription) {
      this.responseSubscription.unsubscribe();
    }
    for(let subscription of this.responseHolder){
      if(subscription&&!subscription.closed){
        subscription.unsubscribe();
      }
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
      this.finalizeResponse();
    } else {
      this.askGPT();
    }
  }

  configuration: Configuration | undefined;
  fileList: NzUploadFile[] = [];
  inputText: string = '';
  animalModel: ChatModel | undefined;
  scrollSubject: Subject<boolean> | undefined;
  chatFileList: FileInChat[] = [];
  private _chatHistoryModel: ChatHistoryModel | undefined;

  get chatHistoryModel(): ChatHistoryModel | undefined {
    return this._chatHistoryModel;
  }

  set chatHistoryModel(value: ChatHistoryModel | undefined) {
    this._chatHistoryModel = value;
    this.chatModels = this._chatHistoryModel?.chatList?.chatModel!;
  }
  initSession = false;
  chatModels: ChatModel[] = [];
  answering: boolean = false;
  notifyChatHistoryIdentifier: boolean = false;
  responseSubscription: Subscription | undefined;
  responseHolder: Subscription[] = [];
  chatContext: ChatContext;

  findLatestTrueRequest(lastId: number): ChatModel | undefined{
    let index = this.chatModels.findIndex(m=>m.dataId===lastId);
    for(let id = index;id>=0;id--){
      let model = this.chatModels[id];
      if(model.role===UserRole||model.role===SystemRole){
        return this.chatModels[id];
      }
    }
    return undefined;
  }
  findNextAssistantModel(id: number):ChatModel | undefined{
    let index = this.chatModels.findIndex(m=>m.dataId === id);
    for(let i = index+1;i<this.chatModels.length;i++){
      let model = this.chatModels[i];
      if(model.role===AssistantRole){
        return model;
      }
    }
    return undefined;
  }

  async reGenerateHandle($event: number) {
    // tackle since model
    let reModel = this.chatModels.find(m=>m.dataId===$event);
    if(reModel===undefined){
      this.notification.error("列表中不存在","");
      return;
    }
    if(reModel.role===SystemRole){
      this.notification.error("不允许的操作","不要重新生成 系统级prompt。");
      return;
    }
    let generateModel: ChatModel | undefined;
    if(reModel.role===AssistantRole){
      generateModel = reModel;
    }else{
      generateModel = this.findNextAssistantModel(reModel.dataId!);
      if(generateModel===undefined){
        generateModel = new ChatModel(AssistantRole);
        generateModel.finish = false;
        generateModel.model = reModel.model;
        generateModel.dataId = reModel.dataId;
        generateModel.reRandom();
        let index = this.chatModels.findIndex(m=>m.dataId===reModel!.dataId);
        this.chatModels.splice(index+1,0,generateModel);
      }
    }
    // 向上查找 用户model，作为 聊天的完成对象
    let endPointerModel = this.findLatestTrueRequest($event);
    if(endPointerModel===undefined){
      this.notification.error("在该消息之前找不到用户信息或者系统信息","");
      return;
    }
    // 添加用户请求
    const requestType = this.showTypeService.getRequestType(endPointerModel.showType);
    let back: number | undefined;
    // back 指针，是为了进行细粒度控制上下文引入的指针，
    // 如果上下文后指针为空，就设置当前 “重新生成”的
    // 后指针为 查找到的上一条用户模型的id（指针就是一个id）
    if(this.chatContext.pointer === undefined || this.chatContext.pointer > endPointerModel.dataId!){
      back = endPointerModel.dataId;
    }else{
      back = this.chatContext.pointer;
    }
    let fetchParam: ChatPacket | ChatVisionPacket | ImagePacket | SpeechPacket | TranscriptionPacket
      = this.resolveContext(requestType,back,endPointerModel.dataId,endPointerModel);
    // 添加返回的 聊天信息模型
    generateModel!.finish = false;
    generateModel!.markAsChanged = true;
    generateModel!.showType = this.showTypeService.getPromiseReceiveType(requestType); // 设置返回模型的展示类型

    let response: Observable<string> = this.modelFetchService.getFetchResponse(
      requestType,fetchParam,generateModel!.model);
    // 订阅返回的数据
    let animalSubscription = this.subscriptionResponse(response,generateModel!,requestType);
    this.responseHolder.push(animalSubscription);
  }
  @ViewChild('chatPanel') private chatPanel: ElementRef | undefined;

  clearContext() {
    this.chatContext.pointer = undefined;
    this.notification.success("清空上下文", "清除成功");
    this.awareContextChange();
  }

  isActive(chat: ChatModel) {
    if(chat.role===SystemRole){
      if(this.chatContext.pointer===undefined){
        let id = chat.dataId;
        let sys = this.chatContext.systems?.find(s=>s.id===id);
        if(sys!==undefined){
          return sys.in;
        }else{
          return false;
        }
      }else{
        if(chat.dataId!>= this.chatContext.pointer){
          return true;
        }
        let id = chat.dataId;
        let sys = this.chatContext.systems?.find(s=>s.id===id);
        if(sys!==undefined){
          return sys.in;
        }else{
          return false;
        }
      }
    }else{
      return this.chatContext.pointer !== undefined && chat.dataId! >= this.chatContext.pointer;
    }

  }

  constructor(private sizeReportService: SizeReportService,
              public sidebarService: SidebarService,
              private visionContextHandler: VisionContextHandler,
              private chatContextHandler: ChatContextHandler,
              private contextMemoryService: ContextMemoryService,
              private renderer: Renderer2,
              private chatDataService: ChatDataService,
              @Inject(chatSessionSubject) private chatSessionObservable: Observable<number>,
              private chatHistoryService: HistoryTitleService,
              @Inject(backChatHistorySubject) private backHistoryObserver: Observer<ChatHistoryTitle>,
              private lastSession: LastSessionModel,
              private configurationService: ConfigurationService,
              private notification: NzNotificationService,
              @Inject(configurationChangeSubject) private configurationObserver: Subject<boolean>,
              private showTypeService: ShowTypeService,
              private modelFetchService: ModelFetchService,
  ) {
    // 添加默认值
    this.chatContext = {
      pointer: undefined,
      systems: [],
      onlyOne: true
    };

    this.configurationObserver.subscribe((change)=>{
      if(change){
        // 响应更改
        this.configuration = this.configurationService.configuration!;
      }
    });
    // 初始化configuration
    this.configuration = this.configurationService.configuration!;
    this.chatSessionObservable.subscribe(async (dataId) => {
      this.initSession = false;
      this.sync(dataId).then(()=>{
        let chatContext = contextMemoryService.getValue(dataId);
        this.inputChatContext(chatContext);
      });
    })
    if (this.chatHistoryModel === undefined && this.lastSession.sessionId) {
      this.initSession = false;
      this.sync(this.lastSession.sessionId).then(async ()=>{
        let chatContext = contextMemoryService.getValue(this.lastSession.sessionId!);
        this.inputChatContext(chatContext);
      });
    }
  }
  resolveContext(requestType: RequestType = RequestType.Chat, startPointer: number|undefined = undefined, endPointer: number | undefined = undefined, reModel: ChatModel | undefined = undefined) {
    if (this.chatModels === undefined) {
      console.log("未知错误")
    }
    if (requestType === RequestType.Image) {
      if(reModel!==undefined){
        return new ImagePacket(reModel.content);
      }
      return new ImagePacket(this.inputText);
    }
    if (requestType === RequestType.Speech) {
      if(reModel!==undefined){
        return new SpeechPacket(reModel.content);
      }
      return new SpeechPacket(this.inputText, this.fileList);
    }
    if (requestType === RequestType.Transcription) {
      if(reModel!==undefined){
        this.notification.error("不支持重新生成该响应","");
        throw new Error("not allowed");
      }
      if (this.inputText !== '') {
        return new TranscriptionPacket(true, this.fileList, this.inputText);
      } else {
        return new TranscriptionPacket(true, this.fileList);
      }
    }
    if(requestType===RequestType.ChatVision){
      let messages = this.visionContextHandler.handler(
        startPointer,
        this.configurationService.configuration!,
        this.chatModels,
        endPointer
      );
      // 添加指针之前的系统消息
      this.visionContextHandler.handlerBefore(this.chatContext,
        this.chatModels,
        messages);
      return new ChatVisionPacket(messages);// todo
    }
    let messages = this.chatContextHandler.handler(
      startPointer,
      this.configurationService.configuration!,
      this.chatModels,
      endPointer
    );
    // 添加指针之前的系统消息
    this.chatContextHandler.handlerBefore(
      this.chatContext,
      this.chatModels,
      messages
    );
    return new ChatPacket(messages);
  }
  async sync(dataId: number) {
    if (dataId === this.lastSession.sessionId) {
    } else {
      // console.log("will open by observer " + dataId)
    }
    try {
      this.chatDataService.getChatHistory(dataId).then((chatHistory)=>{
        if (chatHistory) {
          this.chatHistoryModel = chatHistory;
          this.lastSession.sessionId = dataId;
        } else {
          this.chatHistoryModel = new ChatHistoryModel();
          this.lastSession.sessionId = this.chatHistoryModel.dataId;
        }
        this.initSession = true;
      });
    } catch (error) {
      console.error('Error fetching chat history:', error);
      this.initSession = true;
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
  editModel: ChatModel | undefined;
  awareContextChange(){
    // console.log("storage")
    // console.log(this.chatHistoryModel?.dataId!);
    // console.log(this.chatContext)
    this.contextMemoryService.setValue(this.chatHistoryModel?.dataId!,
      this.chatContext);
  }
  async inputChatContext(chatContext: ChatContext | undefined){
    if(chatContext!==undefined){
      this.chatContext = chatContext;
      if(this.chatContext.systems===undefined){
        this.chatContext.systems = [];
      }
      if(this.chatContext.onlyOne===undefined){
        this.chatContext.onlyOne = true;
      }
    }else{
      this.chatContext = {
        pointer: undefined,
        systems: [],
        onlyOne: true
      };// 更换会话，需要创建新的 会话上下文数据
      await this.waitForSessionInit();
      let ms = this.chatModels.filter(m=>m.role===SystemRole);
      for(let s of ms){
        this.chatContext.systems?.push({
          id: s.dataId!,
          in: false
        });
      }
      if(this.chatContext.onlyOne){
        if(this.chatContext.systems!.length>0){
          this.chatContext.systems![this.chatContext.systems!.length-1].in = true;
        }
      }else{
        for (let s of this.chatContext.systems!){
          s.in = true;
        }
      }
      this.awareContextChange();
    }
  }
  handleUserTask($event: UserTask) {
    switch ($event.task){
      case TaskType.edit:
        const i = this.chatHistoryModel?.chatList?.chatModel!.findIndex(item => item.dataId === $event.id);
        if (i !== undefined) {
          this.editModel = this.chatHistoryModel?.chatList?.chatModel![i];
          this.showModal();
        }
        break;
      case TaskType.asContext:
        this.chatContext.pointer = $event.id;
        this.awareContextChange();
        break;
      case TaskType.delete:
        const index = this.chatHistoryModel?.chatList?.chatModel!.findIndex(item => item.dataId === $event.id);
        if (index !== undefined) {
          let model = this.chatHistoryModel?.chatList?.chatModel![index]!;
          if(model.role===SystemRole){
            this.chatContext.systems = this.chatContext.systems?.filter(si=>si.id!==model.dataId);
          }
          this.chatHistoryModel?.chatList?.chatModel!.splice(index, 1); // 删除符合条件的元素
          this.chatDataService.deleteChatModel($event.id);
        }
        this.chatDataService.putHistory(this.chatHistoryModel!).then(()=>{
        });
        break;
      default:
        break;
    }
  }
  isVisible: boolean = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.editModel!.markAsChanged = true;
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showLogo() {
    return this.chatHistoryModel===undefined || this.chatHistoryModel.chatList?.chatModel?.length===0;
  }
  miniPhone() {
    return this.sizeReportService.miniPhoneView();
  }

  switchSidebar() {
    this.sidebarService.switch();
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
  isBase64Image(fileType: string): boolean {
    return fileType.startsWith("image");
  }
  async buildFileList() {
    const promises = this.fileList.map((file) => this.readFile(file));
    await Promise.all(promises);
  }

  readFile(file: NzUploadFile): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isImg = this.isBase64Image(file.type!);
        let fileContent: string | ArrayBuffer | null;
        if (isImg) {
          fileContent = reader.result;
          if (fileContent == null || fileContent instanceof ArrayBuffer) {
            reject(new Error('File content error'));
            return;
          }
        } else {
          fileContent = '';
        }
        const afile: FileInChat = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileContent: fileContent,
        };
        this.chatFileList.push(afile);
        resolve();
      };

      if (file) {
        // @ts-ignore
        reader.readAsDataURL(file);
      }
    });
  }

  protected readonly RequestType = RequestType;
  showChoice: boolean = false;
  showBallChoice() {
    this.showChoice = !this.showChoice;
  }

  addSystemInfo() {
    this.choiceVisible = true;
  }

  manageSystemContext() {
    this.systemPromptManagerVisible = true;
  }

  choiceVisible: boolean = false;

  handleSystemPromptChoice($event: SystemPromptItem | undefined) {
    // console.log($event)
    if($event!==undefined){
      if (this.chatHistoryModel === undefined) {
        this.chatHistoryModel = new ChatHistoryModel();
      }
      let model = new ChatModel(SystemRole,$event.content,
      );
      let systemContext: SystemContext = {
        id: model.dataId!,
        in: true
      };
      if(this.chatContext.onlyOne){
        for(let system of this.chatContext.systems!){
          system.in = false;
        }
      }
      // 将之前的系统信息移除上下文
      this.chatContext.systems!.push(systemContext);
      this.chatModels.push(model);
      this.awareContextChange();
    }
  }

  handleChoiceClose() {
    this.choiceVisible = false;
    this.showChoice = false;
  }

  systemPromptManagerVisible: boolean = false;
  handleManagerClose() {
    this.systemPromptManagerVisible = false;
    this.showChoice = false;
  }
  private async waitForSessionInit() {
    return new Promise<void>((resolve)=>{
      if(this.initSession){
        resolve();
      }else{
        const interval = setInterval(()=>{
          if(this.initSession){
            clearInterval(interval);
            resolve();
          }
        },10)
      }
    });
  }


}
