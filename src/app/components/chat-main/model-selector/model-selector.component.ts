import {Component, Inject} from '@angular/core';
import {ConfigurationService} from "../../../share-datas";
import {configurationChangeSubject, configurationServiceToken} from "../../../share-datas/datas.module";
import {Subject} from "rxjs";
import {RequestType} from "../../../models";

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrl: './model-selector.component.css'
})
export class ModelSelectorComponent {
  chatStreamChildren: string[] = [];
  imageChildren :string[] = [];
  ttsChildren: string[] = [];
  sttChildren: string[] = [];
  model: string | undefined;
  constructor(@Inject(configurationServiceToken) private configurationService: ConfigurationService,
              @Inject(configurationChangeSubject) private configurationObservable: Subject<boolean>) {
    this.buildSelector();
    this.model = this.configurationService.configuration?.model;
    // console.log("set "+this.model)
    this.configurationObservable.subscribe((ele: boolean)=>{
      this.buildSelector();
      this.model = this.configurationService.configuration?.model;
      console.log("aware "+this.model)
    })
  }
  buildSelector(){
    // console.log('build selector')
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
  async onSelectChange($event: string) {
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
