import {Component, ElementRef, Inject, Renderer2, ViewChild} from '@angular/core';
import {ConfigurationService} from "../../share-datas";
import {Configuration} from "../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {configurationChangeSubject} from "../../share-datas/datas.module";
import {Subject} from "rxjs";
import {
    image_response_formats,
    qualities,
    sizes,
    speech_response_formats,
    styles,
    human_voices, woman_voices, details
} from '../../models/enums/type.data';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent {
    configuration: Configuration;
    sizes: string[] = sizes;
    image_response_formats: string[] = image_response_formats;
    qualities: string[] = qualities;
    styles: string[] = styles;
    humanVoices: string[] = human_voices;
    womanVoices: string[] = woman_voices;
    speech_response_formats: string[] = speech_response_formats;
    details = details;

    constructor(private configurationService: ConfigurationService,
                private notification: NzNotificationService,
                @Inject(configurationChangeSubject) private configurationObserver: Subject<boolean>,
                private renderer: Renderer2,) {

        this.configuration = this.configurationService.configuration!;
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
        console.log("scroll 0")
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
}
