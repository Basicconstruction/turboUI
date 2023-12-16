import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SidebarService{
  isSideBarClosed: boolean = false;
  public switch(){
    this.isSideBarClosed = !this.isSideBarClosed;
  }

  close() {
    this.isSideBarClosed = true;
  }

  open(){
    this.isSideBarClosed = false;
  }
}
