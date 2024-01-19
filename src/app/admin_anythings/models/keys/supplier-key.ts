import {ModelFee} from "./model-fee";

export interface SupplierKey{
  supplierKeyId?: number;
  baseUrl?: string;
  apiKey?:string;
  modelFees?: ModelFee[];
}
