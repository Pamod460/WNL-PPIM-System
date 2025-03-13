import {Materialcategory} from "./Materialcategory";

export interface Materialsubcategory {
  id: number;
  name: string;
  materialcategory: Materialcategory;
}
