import {Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";

@Injectable()
export class ConfigurationResolver{
    constructor(private configurationService: ConfigurationService) {

    }
    resolve() {
        return this.configurationService.accept();
    }
}
