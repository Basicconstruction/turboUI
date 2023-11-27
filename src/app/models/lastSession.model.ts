import {Injectable, InjectionToken} from "@angular/core";

export const LastSessionToken = new InjectionToken("last-session");
@Injectable()
export class LastSessionModel{
    public sessionId: number | undefined;
}
