import {MaterialGrnStatus} from "./MaterialGrnStatus";
import {MaterialPorder} from "./MaterialPorder";
import {MaterialGrnMaterial} from "./MaterialGrnMaterial";

export class MaterialGrn{
  id?: number;
  grandTotal?: number;
  date?: string; // ISO date string (e.g., '2025-07-04')
  time?: string; // ISO time string (e.g., '15:45:00')
  description?: string;
  materialGrnStatus?: MaterialGrnStatus;
  materialPorder?: MaterialPorder;
  code?: string;
  materialGrnMaterials!: MaterialGrnMaterial[];
}
