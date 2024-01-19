import {SupplierKey} from "./supplier-key";
import {Model} from "./model";

export interface ModelFee{
  modelFeeId?: number;
  supplierKeyId?: number;
  supplierKey?: SupplierKey;
  modelId?: number;
  model?:Model;
  fee: number;
}
