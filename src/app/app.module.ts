import {NgModule, isDevMode, SecurityContext} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ChatModule} from "./components/chat.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import {CLIPBOARD_OPTIONS, ClipboardButtonComponent, MarkdownModule, MARKED_OPTIONS} from "ngx-markdown";

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
      // markedOptions: {
      //   provide: MARKED_OPTIONS,
      //   useValue: {
      //     sanitize: true
      //   }
      // },
      sanitize: SecurityContext.HTML,
    }),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChatModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
