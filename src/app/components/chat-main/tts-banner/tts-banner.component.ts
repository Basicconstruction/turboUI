import {Component, Input} from '@angular/core';
import {human_voices, speech_response_formats, woman_voices} from "../../../models/enums/type.data";
import {Configuration} from "../../../models";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-tts-banner',
  templateUrl: './tts-banner.component.html',
  styleUrl: './tts-banner.component.css',
  imports: [
    NzFormModule,
    FormsModule,
    NzSelectModule,
    NgForOf
  ],
  standalone: true
})
export class TtsBannerComponent {

  protected readonly human_voices = human_voices;
  protected readonly woman_voices = woman_voices;
  @Input()
  configuration: Configuration | undefined;

  protected readonly speech_response_formats = speech_response_formats;
}
