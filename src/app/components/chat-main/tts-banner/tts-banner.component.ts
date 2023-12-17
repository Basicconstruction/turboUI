import {Component, Input} from '@angular/core';
import {human_voices, speech_response_formats, woman_voices} from "../../../models/type.data";
import {Configuration} from "../../../models";

@Component({
  selector: 'app-tts-banner',
  templateUrl: './tts-banner.component.html',
  styleUrl: './tts-banner.component.css'
})
export class TtsBannerComponent {

  protected readonly human_voices = human_voices;
  protected readonly woman_voices = woman_voices;
  @Input()
  configuration: Configuration | undefined;

  protected readonly speech_response_formats = speech_response_formats;
}
