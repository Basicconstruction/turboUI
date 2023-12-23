import {Component, Input} from '@angular/core';
import {details} from "../../../models/enums/type.data";
import {Configuration} from "../../../models";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-vision-banner',
  templateUrl: './vision-banner.component.html',
  styleUrl: './vision-banner.component.css',
  imports: [
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NgForOf
  ],
  standalone: true
})
export class VisionBannerComponent {
  @Input()
  configuration: Configuration | undefined;
  protected readonly details = details;
}
