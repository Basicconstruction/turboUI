import {Injectable} from "@angular/core";
import {SystemPromptService} from "./system-prompt.service";
import {ChatModule} from "../../user_pages/chat.module";
import {ChatsRoutingModule} from "../../user_pages/chats-routing.module";

@Injectable()
export class SystemPromptResolver {
  constructor(private systemPromptService: SystemPromptService) {

  }
  resolve() {
    return this.systemPromptService.accept();
  }
}
