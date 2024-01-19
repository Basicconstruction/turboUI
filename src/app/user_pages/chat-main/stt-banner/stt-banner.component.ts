import {Component, Input} from '@angular/core';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Configuration} from "../../../user_anything/models";
import { languages } from '../../../user_anything/models/enumerates/type.data';

@Component({
  selector: 'app-stt-banner',
  templateUrl: './stt-banner.component.html',
  styleUrl: './stt-banner.component.css',
  imports: [
    NzFormModule,
    NzSelectModule,
    FormsModule,
    NgForOf,
    NgIf,
    TranslateModule
  ],
  standalone: true
})
export class SttBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  languages: string[] = languages;

}
