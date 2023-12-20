import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ContextMemoryService{
  public context: Dictionary<ChatContext | undefined> = {

  };
  public getValue(id: number){
    return this.context[id];
  }
  public setValue(key: number,value: ChatContext | undefined){
    this.context[key] = value;
  }
}
interface Dictionary<T> {
  [key: number]: T;
}
export interface ChatContext{
  pointer: number | undefined;
  systems: SystemContext[] | undefined;
  onlyOne: boolean;
}
export interface SystemContext{
  id: number;
  in: boolean;
}
