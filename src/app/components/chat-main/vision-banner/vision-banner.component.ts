import {Component, Input} from '@angular/core';
import {details} from "../../../models/type.data";
import {Configuration} from "../../../models";

@Component({
  selector: 'app-vision-banner',
  templateUrl: './vision-banner.component.html',
  styleUrl: './vision-banner.component.css'
})
export class VisionBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  protected readonly details = details;
}
