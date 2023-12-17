import {Component, Input} from '@angular/core';
import {ConfigurationModel} from "../../../models";

@Component({
  selector: 'app-config-export',
  templateUrl: './config-export.component.html',
  styleUrl: './config-export.component.css'
})
export class ConfigExportComponent {
  @Input()
  config: ConfigurationModel | undefined;
}
