import {Component, Input} from '@angular/core';
import {ConfigurationModel} from "../../../models";
import {details} from "../../../models/type.data";

@Component({
  selector: 'app-vision-banner',
  templateUrl: './vision-banner.component.html',
  styleUrl: './vision-banner.component.css'
})
export class VisionBannerComponent {
  @Input()
  configuration: ConfigurationModel | undefined;
  protected readonly details = details;
}
