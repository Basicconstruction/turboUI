import {Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class ConfigurationResolver{
    constructor(private configurationService: ConfigurationService) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.configurationService.init();
    }
}
