import {Paper} from "./Paper";

export class ProductPaper {
  paper?: Paper;
  lineCost?: number;
  quantity?: number;
  id?: number;
  name?: string;

  constructor(id: number, paper: Paper,  quantity: number,lineCost: number) {
    this.id = id;
    this.paper = paper;
    this.lineCost = lineCost;
    this.quantity = quantity;
  }


}
