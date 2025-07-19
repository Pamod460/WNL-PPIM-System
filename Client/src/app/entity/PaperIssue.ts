import {Productionorder} from "./productionorder";
import {IssuedPaper} from "./IssuedPaper";

export class PaperIssue {

id!: number;
  code!: string;
  date!: string | null;
  issuedDate!: string | null;
  issuedTime!: string;
  productionOrder?: Productionorder;
  issuedPapers!: IssuedPaper[];
  logger!: string;

}
