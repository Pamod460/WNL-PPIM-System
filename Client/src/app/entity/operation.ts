import {Module} from "./module";
import {Opetype} from "./opetype";

export class Operation {

  public id !: number;
  public name !: string;
  public module!:Module;
  public opetype!:Opetype;

  constructor(id:number,name:string,module:Module,opetype:Opetype) {
    this.id=id;
    this.name=name;
    this.module = module;
    this.opetype = opetype;
  }

}


