import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SizeReportService{
  width: number | undefined;
  height: number | undefined;
  public miniPhoneView() {
    if(!this.width) return false;
    return this.width <= 606;
  }
}
