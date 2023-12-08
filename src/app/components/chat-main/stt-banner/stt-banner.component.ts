import {Component, Input} from '@angular/core';
import {ConfigurationModel} from "../../../models";
import {languages} from "../../../models/type.data";

@Component({
  selector: 'app-stt-banner',
  templateUrl: './stt-banner.component.html',
  styleUrl: './stt-banner.component.css'
})
export class SttBannerComponent {
  @Input()
  configuration: ConfigurationModel | undefined;
  languages: string[] = languages;

}
