import {Product} from "./Product";

export class DistributionProduct {
  id?: number;
  quantity?: number;
  product?: Product;
  lineTotal?: number;

  constructor(id?: number, product?: Product,  quantity?: number,lineTotal?: number) {
    this.id = id;
    this.quantity = quantity;
    this.product = product;
    this.lineTotal = lineTotal;
  }


}
