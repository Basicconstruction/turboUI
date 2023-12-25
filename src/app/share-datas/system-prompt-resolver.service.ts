import {Injectable} from "@angular/core";
import {SystemPromptService} from "./system-prompt.service";

@Injectable({
  providedIn: "root"
})
export class SystemPromptResolver {
  constructor(private systemPromptService: SystemPromptService) {

  }
  resolve() {
    return this.systemPromptService.accept();
  }
}
