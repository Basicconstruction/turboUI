import {Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

@Injectable()
export class ConfigurationResolver{
    constructor(private configurationService: ConfigurationService) {

    }
    resolve() {
        return this.configurationService.accept();
    }
}
