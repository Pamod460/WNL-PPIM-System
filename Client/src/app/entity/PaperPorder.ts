import {PaperPorderStatus} from "./PaperPorderStatus";
import {PaperPorderPaper} from "./PaperPorderPaper";
import {Supplier} from "./Supplier";


export class PaperPorder{
  id?: number;
  poNumber?: string;
  date?: Date;
  expectedCost?: number;
  description?: string;
  logger?: string;
  paperPorderStatus?: PaperPorderStatus;
  paperPorderPapers?: PaperPorderPaper[];
  supplier?:Supplier
  smApproved!: boolean;
  accountentApproved !:boolean;
  approvedManagerName!: string;
  approvedAccountantName!: string;

}
