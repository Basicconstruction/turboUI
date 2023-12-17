import {Component, EventEmitter, Output} from '@angular/core';
import {ConfigurationModel} from "../../../models";

@Component({
  selector: 'app-config-import',
  templateUrl: './config-import.component.html',
  styleUrl: './config-import.component.css'
})
export class ConfigImportComponent {
  @Output()
  configInput = new EventEmitter<ConfigurationModel>();

}
