import {Unittype} from "./Unittype";
import {Materialstatus} from "./Materialstatus";
import {MaterialSubcategory} from "./MaterialSubcategory";
import {MaterialCategory} from "./MaterialCategory";

export class Material {
  id?: number;
  code?: string;
  name?: string;
  quantity?: number;
  rop?: number;
  unitPrice?: number;
  description?: string;
  dointroduced?: Date;
  photo?: string;
  unitType?: Unittype;
  materialStatus?: Materialstatus;
  materialSubcategory?: MaterialSubcategory;
  materialCategory?: MaterialCategory;
}
