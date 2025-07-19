import {Paper} from "./Paper";

export class IssuedPaper {

    id!: number;
    quantity!: number;
    paper!: Paper;

  constructor(id: number, quantity: number, paper: Paper) {
    this.id = id;
    this.quantity = quantity;
    this.paper = paper;
  }
}
