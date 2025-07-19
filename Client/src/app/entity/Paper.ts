import {PaperStatus} from "./PaperStatus";
import {PaperUnitType} from "./PaperUnitType";
import {PaperGsm} from "./PaperGsm";
import {PaperSize} from "./PaperSize";
import {PaperType} from "./PaperType";
import {PaperColor} from "./PaperColor";

export class Paper {
  id?: number;
  name?: string;
  unitPrice!: number;
  paperstatus?: PaperStatus;
  photo?: string;
  paperUnitType?: PaperUnitType;
  code?: string;
  doIntroduced?: string;
  description?: string;
  paperGsm?: PaperGsm;
  paperSize?: PaperSize;
  paperType?: PaperType;
  paperColor?: PaperColor;
  paperStatus?: PaperStatus;
  rop?: number; // Reorder Point
  qoh?: number; // Quantity on Hand
  logger?: string;
}
