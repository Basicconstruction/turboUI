import {Component, Input} from '@angular/core';
import {Configuration} from "../../../models";
import {languages} from "../../../models/enums/type.data";

@Component({
  selector: 'app-stt-banner',
  templateUrl: './stt-banner.component.html',
  styleUrl: './stt-banner.component.css'
})
export class SttBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  languages: string[] = languages;

}
