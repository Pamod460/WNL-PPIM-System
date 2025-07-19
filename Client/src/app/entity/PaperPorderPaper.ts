import {Paper} from "./Paper";

export class PaperPorderPaper {
  id!: number;
  paper!: Paper;
  quentity!: number;
  expectedLineCost!: number;

  constructor(id: number, paper: Paper, quentity: number, expectedLineCost: number) {
    this.id = id;
    this.paper = paper;
    this.quentity = quentity;

    this.expectedLineCost = expectedLineCost
  }
}
