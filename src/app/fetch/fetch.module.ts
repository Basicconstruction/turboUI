import {NgModule} from "@angular/core";
import {DatasModule} from "../share-datas/datas.module";
import {OpenaiService} from "./openai.service";

@NgModule(
    {
        providers: [
          OpenaiService,
        ],
        imports: [
          DatasModule
        ],
        declarations: [

        ],
        exports: [

        ]
    }
)
export class FetchModule{

}
