import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ChatModel} from "../../../models";

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrl: './model-editor.component.css'
})
export class ModelEditorComponent{
  @Input()
  chatModel: ChatModel | undefined;
  expand: boolean = false;

}
