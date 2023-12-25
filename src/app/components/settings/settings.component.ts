import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {ConfigurationService} from "../../share-datas";
import {Configuration} from "../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Subject} from "rxjs";
import {
  image_response_formats,
  qualities,
  sizes,
  speech_response_formats,
  styles,
  human_voices, woman_voices, details
} from '../../models/enums/type.data';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {RouterLink} from "@angular/router";
import {NgForOf, NgStyle} from "@angular/common";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {ConfigExportComponent} from "./config-export/config-export.component";
import {ConfigImportComponent} from "./config-import/config-import.component";
import {configurationChangeSubject} from "../../tokens/subject.data";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {themes, ThemeSwitcherService} from "../../services";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  standalone: true,
  imports: [
    NzFormModule,
    NzModalModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzPopoverModule,
    NzInputNumberModule,
    NzSliderModule,
    FormsModule,
    NzInputModule,
    RouterLink,
    NgStyle,
    NzSelectModule,
    NzSwitchModule,
    NzSkeletonModule,
    ConfigExportComponent,
    ConfigImportComponent,
    NgForOf,
    NzToolTipModule,
  ],
  providers: [
    ThemeSwitcherService
  ]
})
export class SettingsComponent {
  theme: string | undefined;
  configuration: Configuration;
  sizes: string[] = sizes;
  image_response_formats: string[] = image_response_formats;
  qualities: string[] = qualities;
  styles: string[] = styles;
  humanVoices: string[] = human_voices;
  womanVoices: string[] = woman_voices;
  speech_response_formats: string[] = speech_response_formats;
  details = details;

  constructor(private themeSwitcherService: ThemeSwitcherService,
              private configurationService: ConfigurationService,
              private notification: NzNotificationService,
              @Inject(configurationChangeSubject) private configurationObserver: Subject<boolean>,
              private renderer: Renderer2,) {
    this.configuration = this.configurationService.configuration!;
    this.configurationObserver.subscribe((change) => {
      if (change) {
        // 响应更改
        this.configuration = this.configurationService.configuration!;
      }
    });
  }

  async resetConfiguration() {
    await this.configurationService.restoreConfiguration();
    this.configuration = this.configurationService.configuration!;
    this.notification
      .create(
        "success",
        '重置成功',
        '参数重置成功'
      );
    this.configurationObserver.next(true);
  }


  async applyChangeRightNow() {
    await this.configurationService.setConfigurationLocal();
    this.notification
      .create(
        "success",
        '应用成功',
        '保存到本地数据库成功'
      );
  }

  @ViewChild('settingPanel') private settingPanel: ElementRef | undefined;
  inputConfigVisible: boolean = false;
  outputConfigVisible: boolean = false;

  scrollToTop() {
    if (!this.settingPanel) return;
    this.renderer.setProperty(this.settingPanel.nativeElement, 'scrollTop', 0);
    // console.log("scroll 0")
  }

  handleInputConfigOk() {
    this.inputConfigVisible = false;
  }

  closeOutput() {
    this.outputConfigVisible = false;
  }

  okAndCloseOutput() {
    this.outputConfigVisible = false;
  }

  handleInputCancel() {
    this.inputConfigVisible = false;
  }

  async handleConfigInput($event: Configuration) {
    this.configurationService.configuration = $event;
    this.configuration = $event;
    await this.configurationService.setConfigurationLocal();
  }

  protected readonly themes = themes;

  themeChange() {
    this.themeSwitcherService.load(this.theme);
  }
}
