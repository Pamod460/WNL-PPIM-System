
import {Item} from "./item";


export class Invoiceitem {

  public id!:number;
  public  item:Item;
  public quantity !: number;
  public linetotal !: number;

  constructor(id:number,item:Item,quantity:number,linetotal:number) {
    this.id = id;
    this.item = item;
    this.quantity = quantity;
    this.linetotal = linetotal;
  }

}


