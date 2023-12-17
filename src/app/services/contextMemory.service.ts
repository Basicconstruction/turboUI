import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ContextMemoryService{
  public context: Dictionary<number | undefined> = {

  };
  public getValue(id: number){
    return this.context[id];
  }
  public setValue(key: number,value: number | undefined){
    this.context[key] = value;
  }
}
interface Dictionary<T> {
  [key: number]: T;
}
