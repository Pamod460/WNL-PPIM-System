import {Material} from "./Material";
import {MaterialPorder} from "./MaterialPorder";

export class MaterialPorderMaterial {


  id!: number;
  materialPorder!: MaterialPorder;
  material!: Material;
  quantity!: number;
  expectedLineCost!: number;

  constructor(id: number, material: Material, quentity: number, expectedLineCost: number) {
    this.id = id;
    this.material = material;
    this.quantity = quentity;
    this.expectedLineCost = expectedLineCost;
  }
}
