import {Component, Input} from '@angular/core';
import {Configuration} from "../../../models";
import {image_response_formats, languages, qualities, sizes, styles} from '../../../models/type.data';

@Component({
  selector: 'app-dall-banner',
  templateUrl: './dall-banner.component.html',
  styleUrl: './dall-banner.component.css'
})
export class DallBannerComponent {
  @Input()
  configuration : Configuration | undefined;
  sizes: string[] = sizes;
  qualities: string[] = qualities;
  styles: string[] = styles;


  protected readonly languages = languages;
}
