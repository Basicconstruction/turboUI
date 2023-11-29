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
  model: string | undefined;
  constructor(private configurationService: ConfigurationService,
              @Inject(configurationChangeSubject) private configurationObservable: Subject<boolean>) {
    this.buildSelector();
    this.model = this.configurationService.configuration?.model;
    this.configurationObservable.subscribe((ele: boolean)=>{
      this.buildSelector();
      this.model = this.configurationService.configuration?.model;
    })
  }
  buildSelector(){
    this.chatStreamChildren.length = 0;
    this.imageChildren.length = 0;
    for(let model of this.configurationService.configuration?.chatConfiguration!.models!){
      this.chatStreamChildren.push(model)
    }
    for(let model of this.configurationService.configuration?.imageConfiguration!.models!){
      this.imageChildren.push(model)
    }
  }
  async onSelectChange($event: string) {
    this.configurationService!.configuration!.model! = this.model!;
    if(this.model!.startsWith("gpt")){
      this.configurationService.configuration!.type! = GPTType.ChatStream;
    }else{
      this.configurationService.configuration!.type! = GPTType.Image;
    }
    await this.configurationService.setConfigurationLocal();
  }
}
