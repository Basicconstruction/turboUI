import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {SystemInfoService} from "./systemInfo.service";

@Injectable()
export class SystemInfoResolver{
  constructor(private systemInfoService: SystemInfoService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.systemInfoService.accept();
  }
}
