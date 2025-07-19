import {Productionorder} from "./productionorder";
import {IssuedMaterial} from "./IssuedMaterial";

export class MaterialIssue{
  id!: number;
  code!: string;
  date!: string | null;
  issuedDate!: string | null;
  issuedTime!: string;
  productionOrder?: Productionorder;
  issuedMaterials!: IssuedMaterial[];
  logger!: string;

}
