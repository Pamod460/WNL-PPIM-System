import {PaperPorder} from "./PaperPorder";
import {PaperGrnStatus} from "./PaperGrnStatus";
import {PaperGrnPaper} from "./PaperGrnPaper";

export class PaperGrn{
  id?: number;
  grandTotal?: number;
  date?: string; // ISO date string (e.g., '2025-07-04')
  time?: string; // ISO time string (e.g., '15:45:00')
  description?: string;
  paperGrnStatus?: PaperGrnStatus;
  paperPorder?: PaperPorder;
  code?: string;
  paperGrnPapers!: PaperGrnPaper[];
}
