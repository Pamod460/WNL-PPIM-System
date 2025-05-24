import {MaterialCategory} from "./MaterialCategory";
import {SelectableItem} from "../util/dialog/material-checklist-dialog/checklist-dialog.component";

export class MaterialSubcategory implements SelectableItem{
  id!: number;
  name!: string;
  materialCategory?: MaterialCategory;
}
