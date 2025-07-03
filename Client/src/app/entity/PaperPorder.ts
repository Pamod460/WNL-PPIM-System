import {PaperPorderStatus} from "./PaperPorderStatus";
import {PaperPorderPaper} from "./PaperPorderPaper";


export class PaperPorder{
  id?: number;
  poNumber?: string;
  date?: Date;
  expectedCost?: number;
  description?: string;
  logger?: string;
  paperPorderStatus?: PaperPorderStatus;
  paperPorderMaterials?: PaperPorderPaper[];
}
