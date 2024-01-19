import {Injectable} from "@angular/core";
import {ConfigurationService} from "./configuration.service";
import {ChatModule} from "../../user_pages/chat.module";
import {ChatsRoutingModule} from "../../user_pages/chats-routing.module";

@Injectable()
export class ConfigurationResolver{
    constructor(private configurationService: ConfigurationService) {

    }
    resolve() {
        return this.configurationService.accept();
    }
}
