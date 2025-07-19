import {Supplierpayment} from "./supplierpayment";
import {PaperGrn} from "./PaperGrn";
import {MaterialGrn} from "./MaterialGrn";

export class Supplierpaymentgrn{
  id?: number;
  supplierPaymentDto?: Supplierpayment;
  paperGrn?: PaperGrn|null;
  materialGrn?: MaterialGrn|null;


  constructor(paperGrn: PaperGrn|null, materialGrn: MaterialGrn|null) {
    this.paperGrn = paperGrn;
    this.materialGrn = materialGrn;
  }
}
