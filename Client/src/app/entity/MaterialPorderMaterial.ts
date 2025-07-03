import {Material} from "./Material";
import {MaterialPorder} from "./MaterialPorder";

export class MaterialPorderMaterial {


  id!: number;
  materialPorder!: MaterialPorder;
  material!: Material;
  quentity!: number;
  expectedLineCost!: number;

  constructor(id: number, material: Material, quentity: number, expectedLineCost: number) {
    this.id = id;
    this.material = material;
    this.quentity = quentity;
    this.expectedLineCost = expectedLineCost;
  }
}
