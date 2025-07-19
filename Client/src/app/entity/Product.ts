import {ProductStatus} from "./ProductStatus";
import {ProductCategory} from "./ProductCategory";
import {ProductFrequency} from "./ProductFrequency";
import {ProductMaterial} from "./ProductMaterial";
import {ProductPaper} from "./ProductPaper";

export class Product{
  id?: number;
  code?: string;
  name?: string;
  quentity?: number;
  dointroduced?: Date;
  unitPrice?: number;
  agentPrice?: number;
  description?: string;
  photo?: Uint8Array | string; // could be base64 string from API
  productStatus?: ProductStatus;
  productCategory?: ProductCategory;
  productfrequency?: ProductFrequency;
  productMaterials?: ProductMaterial[];
  productPapers?: ProductPaper[];
}
