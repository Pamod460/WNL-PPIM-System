import {Product} from "./Product";
import {Productdesign} from "./productdesign";

export class AgentOrderProduct {
  id?: number;
  quantity?: number;
  product?: Product;
  lineTotal?: number;
  productDesign?: Productdesign;

  constructor(id?: number, product?: Product, productDesign?:Productdesign,  quantity?: number,lineTotal?: number) {
    this.id = id;
    this.quantity = quantity;
    this.product = product;
    this.lineTotal = lineTotal;
    this.productDesign = productDesign;
  }


}
