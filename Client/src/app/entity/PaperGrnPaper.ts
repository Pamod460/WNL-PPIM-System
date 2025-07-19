import {Paper} from "./Paper";

export class PaperGrnPaper {

  id!: number;
  paper!: Paper;
  quantity!: number;
  lineCost!: number;
  unitPrice!:number
  constructor(id: number, paper: Paper, quantity: number, lineCost: number, unitPrice: number) {
    this.id = id;
    this.paper = paper;
    this.quantity = quantity;
    this.lineCost = lineCost;
    this.unitPrice= unitPrice;
  }
}
