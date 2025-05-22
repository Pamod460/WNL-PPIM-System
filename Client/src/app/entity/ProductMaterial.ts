import {Material} from "./Material";

export interface ProductMaterial{
  lineCost: number;
  id?: number;
  name?: string;
  material?: Material;
  quantity?: number;
}
