import {Component, Inject} from '@angular/core';
import {ConfigurationService} from "../../../share-datas";
import {configurationChangeSubject} from "../../../share-datas/datas.module";
import {Subject} from "rxjs";
import {GPTType} from "../../../models/GPTType";

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
  constructor(private configurationService: ConfigurationService,
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
    if(this.model!.startsWith("gpt")){
      this.configurationService.configuration!.type! = GPTType.ChatStream;
    }else if(this.model!.startsWith("dall")){
      this.configurationService.configuration!.type! = GPTType.Image;
    }else if(this.model?.startsWith("tts")){
      this.configurationService.configuration!.type! = GPTType.Speech;
    }else if(this.model?.startsWith("whisper")){
      this.configurationService.configuration!.type! = GPTType.Transcriptions;
    }
    await this.configurationService.setConfigurationLocal();
  }
}
