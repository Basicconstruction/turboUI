import {Component, Input} from '@angular/core';
import {Configuration} from "../../../models";
import {languages} from "../../../models/enums/type.data";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-stt-banner',
  templateUrl: './stt-banner.component.html',
  styleUrl: './stt-banner.component.css',
  imports: [
    NzFormModule,
    NzSelectModule,
    FormsModule,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class SttBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  languages: string[] = languages;

}
