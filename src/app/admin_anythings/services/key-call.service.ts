import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";
import {Model, SupplierKey} from "../models/keys";
import {provide} from "../../share/roots";

@Injectable({
  providedIn: "root"
})
export class KeyCallService{
  constructor(private http: HttpClient,
              private message: NzMessageService) {
  }
  getModelsWithKey(keyId?: number){
    if(keyId===undefined){
      return this.http.get<Model[]>(`${provide()}/api/model`);
    }
    return this.http.get<Model[]>(`${provide()}/api/model?keyId=${keyId}`);
  }
  deleteModel(modelId: number){
    return this.http.delete<any>(`${provide()}/api/model/${modelId}`);
  }
  addModel(name: string){
    return this.http.post<any>(`${provide()}/api/model`,{name: name});
  }
  updateModel(model: Model){
    return this.http.post<any>(`${provide()}/api/model`,model);
  }
  getKeyById(keyId: number){
    return this.http.get<SupplierKey>(`${provide()}/api/key/${keyId}`);
  }
  getKeysWithModel(modelId?: number){
    if(modelId===undefined){
      return this.http.get<SupplierKey[]>(`${provide()}/api/key`);
    }
    return this.http.get<SupplierKey[]>(`${provide()}/api/key?modelId=${modelId}`);
  }
  deleteKey(keyId: number){
    return this.http.delete<any>(`${provide()}/api/key/${keyId}`);
  }
  addKey(key: SupplierKey){
    return this.http.post<any>(`${provide()}/api/key`,key);
  }
  updateKey(key: SupplierKey){
    return this.http.put<any>(`${provide()}/api/key/${key.supplierKeyId}`,key);
  }


}
