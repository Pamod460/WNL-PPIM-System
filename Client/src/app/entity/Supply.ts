import {MaterialSubcategory} from "./MaterialSubcategory";

export class Supply{

  materialSubcategory!: MaterialSubcategory;


  constructor(materialSubcategory: MaterialSubcategory) {
    this.materialSubcategory = materialSubcategory;
  }
}
