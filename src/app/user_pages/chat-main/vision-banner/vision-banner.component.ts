import {Component, Input} from '@angular/core';
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NgForOf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Configuration} from "../../../user_anything/models";
import { details } from '../../../user_anything/models/enumerates/type.data';

@Component({
  selector: 'app-vision-banner',
  templateUrl: './vision-banner.component.html',
  styleUrl: './vision-banner.component.css',
  imports: [
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NgForOf,
    TranslateModule
  ],
  standalone: true
})
export class VisionBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  protected readonly details = details;
}
