import {Injectable} from "@angular/core";
import {Configuration, DynamicConfig} from "../models";
import {TranslateService} from "@ngx-translate/core";
import {ThemeSwitcherService} from "./themeSwitcher.service";

@Injectable()
export class DynamicConfigService{
  constructor(private translate: TranslateService,
              private themeSwitcherService: ThemeSwitcherService,) {
  }
  initDynamic(dynamic: DynamicConfig | undefined){
    if(dynamic===undefined){
      return;
    }
    this.themeSwitcherService.load(dynamic.theme);
    this.translate.addLangs(['en', 'zh','jp']);
    this.translate.setDefaultLang('zh');

    let lang: string | undefined;
    if(dynamic.languageIsSet){
      lang = dynamic.language;
    }else{
      lang = this.translate.getBrowserLang()!;
      dynamic.language = lang;
    }
    this.translate.use(lang!.match(/en|zh|jp/) ? lang! : 'zh');
  }
  public getDynamicConfig(configuration: Configuration): DynamicConfig | undefined{
    let dynamic = configuration.dynamic;
    if(dynamic===undefined||dynamic.length===0){
      return undefined;
    }
    return JSON.parse(dynamic);
  }
  public setDynamicConfig(configuration: Configuration, dynamicConfig: DynamicConfig){
    configuration.dynamic = JSON.stringify(dynamicConfig);
  }
  public getDefaultDynamicConfig(): DynamicConfig{
    return {
      theme: 'next-light',
      language: 'zh',
      languageIsSet: false
    }
  }
}
