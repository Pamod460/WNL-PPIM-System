import {MaterialPorderStatus} from "./MaterialPorderStatus";
import {MaterialPorderMaterial} from "./MaterialPorderMaterial";
import {Supplier} from "./Supplier";

export class MaterialPorder{
  id!: number; // optional for new instances
  poNumber!: string;
  date!: Date; // LocalDate → Date
  expectedCost!: number; // BigDecimal → number
  description!: string;
  logger!: string; // not null
  materialPorderStatus?: MaterialPorderStatus; // not null
  materialPorderMaterials?: MaterialPorderMaterial[];
  supplier?:Supplier
  smApproved!: boolean;
  accountentApproved !:boolean;
  approvedManagerName!: string;
  approvedAccountantName!: string;

}
