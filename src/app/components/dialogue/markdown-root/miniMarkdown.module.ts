import {NgModule} from "@angular/core";
import {MarkdownRootComponent} from "./markdown-root.component";
import {CopiedButtonComponent} from "./copied-button/copied-button.component";
import {MarkdownModule, MARKED_OPTIONS, provideMarkdown} from "ngx-markdown";

@NgModule({
  imports: [
    CopiedButtonComponent,
    MarkdownModule
  ],
  declarations: [
    MarkdownRootComponent,
  ],
  exports: [
    MarkdownRootComponent
  ],
  providers: [

  ]
})
export class MiniMarkdownModule{

}
