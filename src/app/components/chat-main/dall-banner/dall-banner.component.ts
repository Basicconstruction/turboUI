import {Component, Input} from '@angular/core';
import {Configuration} from "../../../models";
import {languages, qualities, sizes, styles} from '../../../models/enums/type.data';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-dall-banner',
  templateUrl: './dall-banner.component.html',
  styleUrl: './dall-banner.component.css',
  imports: [
    NzFormModule,
    NzSelectModule,
    FormsModule,
    NzInputNumberModule,
    NgForOf,
    TranslateModule
  ],
  standalone: true
})
export class DallBannerComponent {
  @Input()
  configuration : Configuration | undefined;
  sizes: string[] = sizes;
  qualities: string[] = qualities;
  styles: string[] = styles;

  protected readonly languages = languages;
}
