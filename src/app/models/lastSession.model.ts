import {Injectable, InjectionToken} from "@angular/core";
@Injectable(
  {
    providedIn: "root"
  }
)
export class LastSessionModel{
    public sessionId: number | undefined;
}
