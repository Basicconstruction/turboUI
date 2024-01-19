import {Injectable} from "@angular/core";

@Injectable()
export class SizeReportService{
  width: number | undefined;
  height: number | undefined;
  public miniPhoneView() {
    if(!this.width) return false;
    return this.width <= 606;
  }
  public superMiniView(){
    if(!this.width) return false;
    return this.width <= 300;
  }
}
