import {PaperType} from "./PaperType";

export class PaperSupply{
  paperType!: PaperType;
  constructor(paperType: PaperType) {
    this.paperType = paperType;
  }
}
