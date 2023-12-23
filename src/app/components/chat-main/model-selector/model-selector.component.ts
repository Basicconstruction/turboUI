import {Component, Inject} from '@angular/core';
import {ConfigurationService} from "../../../share-datas";
import {configurationChangeSubject} from "../../../share-datas/datas.module";
import {Subject} from "rxjs";
import {RequestType} from "../../../models";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrl: './model-selector.component.css',
  imports: [
    FormsModule,
    NzSelectModule,
    NgForOf
  ],
  standalone: true
})
export class ModelSelectorComponent {
  chatStreamChildren: string[] = [];
  imageChildren :string[] = [];
  ttsChildren: string[] = [];
  sttChildren: string[] = [];
  model: string | undefined;
  constructor(private configurationService: ConfigurationService,
              @Inject(configurationChangeSubject) private configurationObservable: Subject<boolean>) {
    this.buildSelector();
    this.model = this.configurationService.configuration?.model;
    this.configurationObservable.subscribe(()=>{
      this.buildSelector();
      this.model = this.configurationService.configuration?.model;
    })
  }
  buildSelector(){
    this.chatStreamChildren.length = 0;
    this.imageChildren.length = 0;
    this.ttsChildren.length = 0;
    this.sttChildren.length = 0;
    for(let model of this.configurationService.configuration?.chatConfiguration!.models!){
      this.chatStreamChildren.push(model)
    }
    for(let model of this.configurationService.configuration?.imageConfiguration!.models!){
      this.imageChildren.push(model)
    }
    for(let model of this.configurationService.configuration?.speechConfiguration!.models!){
      this.ttsChildren.push(model)
    }
    for(let model of this.configurationService.configuration?.transcriptionConfiguration!.models!){
      this.sttChildren.push(model)
    }
  }
  async onSelectChange() {
    this.configurationService!.configuration!.model! = this.model!;
    if(this.model!.includes("vision")){
      this.configurationService.configuration!.requestType! = RequestType.ChatVision;
    }
    else if(this.model!.startsWith("gpt")){
      this.configurationService.configuration!.requestType! = RequestType.Chat;
    }else if(this.model!.startsWith("dall")){
      this.configurationService.configuration!.requestType! = RequestType.Image;
    }else if(this.model?.startsWith("tts")){
      this.configurationService.configuration!.requestType! = RequestType.Speech;
    }else if(this.model?.startsWith("whisper")){
      this.configurationService.configuration!.requestType! = RequestType.Transcription;
    }
    await this.configurationService.setConfigurationLocal();
  }
}
