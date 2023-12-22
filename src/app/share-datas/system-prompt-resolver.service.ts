import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {SystemPromptService} from "./system-prompt.service";

@Injectable()
export class SystemPromptResolver {
  constructor(private systemPromptService: SystemPromptService) {

  }
  resolve() {
    return this.systemPromptService.accept();
  }
}
