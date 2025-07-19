import {Material} from "./Material";

export class IssuedMaterial{
  id!: number;
  quantity!: number;
  material!: Material;

  constructor(id: number, quantity: number, material: Material) {
    this.id = id;
    this.quantity = quantity;
    this.material = material;
  }
}
