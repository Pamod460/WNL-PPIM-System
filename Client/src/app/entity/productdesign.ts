import {Productdesignstatus} from "./productdesignstatus";
import {User} from "./user";
import {Product} from "./Product";

export class Productdesign{
  id!: number;
  product!: Product;
  name!: string;
  description!: string;
  designDocument!: string;
  images!: string;
  productDesignStatus!: Productdesignstatus;
  date!: string;
  createdBy!: User;
  logger!: string;
}
