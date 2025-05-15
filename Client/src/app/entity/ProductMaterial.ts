import {Material} from "./Material";

export interface ProductMaterial{
  linecost: number;
  id?: number;
  name?: string;
  material?: Material;
  quantity?: number;
}
