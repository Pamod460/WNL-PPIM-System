import {Unittype} from "./Unittype";
import {Materialstatus} from "./Materialstatus";
import {Materialsubcategory} from "./Materialsubcategory";

export interface Material {
  id?: number;
  code: string;
  name: string;
  quantity: number;
  rop: number;
  unitprice: number;
  description?: string;
  dointroduced?: Date;
  photo?: string;
  unittype: Unittype;
  materialstatus: Materialstatus;
  materialsubcategory: Materialsubcategory;
}
