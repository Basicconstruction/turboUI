import {Inject, Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {configurationServiceToken} from "./datas.module";

@Injectable()
export class ConfigurationResolver{
    constructor(@Inject(configurationServiceToken) private configurationService: ConfigurationService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.configurationService.init();
    }
}
