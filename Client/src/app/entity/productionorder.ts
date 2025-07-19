import {Productdesign} from "./productdesign";
import {Productionorderstatus} from "./productionorderstatus";

export class Productionorder{
  id!: number;
  orderNo!: string;
  quantity!: number;
  createdDate!: string;
  createdTime!: string;
  expectedDate!: string;
  expectedTime!: string;
  description!: string;
  productDesign!: Productdesign;
  productionOrderStatus!: Productionorderstatus;
  logger!: string;
}
