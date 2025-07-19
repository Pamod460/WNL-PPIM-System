import {Material} from "./Material";

export class ProductMaterial{
  lineCost?: number;
  id?: number;
  name?: string;
  material?: Material;
  quantity?: number;


  constructor(id: number, material: Material,lineCost: number,  quantity: number) {
    this.lineCost = lineCost;
    this.id = id;
    this.material = material;
    this.quantity = quantity;
  }
}
