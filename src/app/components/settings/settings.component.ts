import {Component, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {ConfigurationService} from "../../share-datas";
import {ConfigurationModel} from "../../models";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {configurationChangeSubject} from "../../share-datas/datas.module";
import {Subject} from "rxjs";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent {
    configuration: ConfigurationModel;
    sizes: string[] = [
        "1024x1024",
        "1024x1792",
        "1792x1024"
    ];
    response_formats: string[] = [
      "url","b64_json"
    ];
    qualities: string[] = [
      "hd","standard"
    ];
    styles: string[] = [
      "vivid","natural"
    ]


    constructor(private configurationService: ConfigurationService,
                private notification: NzNotificationService,
                @Inject(configurationChangeSubject) private configurationObserver: Subject<boolean>) {
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
}