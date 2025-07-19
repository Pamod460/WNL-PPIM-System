import {Material} from "./Material";

export class MaterialGrnMaterial{

  id!: number;
  material!: Material;
  quantity!: number;
  lineCost!: number;
  unitPrice!:number
  constructor(id: number, material: Material, quantity: number, lineCost: number, unitPrice: number) {
    this.id = id;
    this.material = material;
    this.quantity = quantity;
    this.lineCost = lineCost;
    this.unitPrice= unitPrice;
  }
}
