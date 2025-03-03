import {Customer} from "./customer";
import {Invoicestatus} from "./invoicestatus";
import {Invoiceitem} from "./invoiceitem";

export class Invoice {

  public id !: number;
  public name !: string;
  public date !: string;
  public time !: string;
  public grandtotal !: number;
  public invoiceitem!:Invoiceitem[];
  public customer!:Customer;
  public invoicestatus!:Invoicestatus;

  constructor(id:number,name:string,date:string,time:string,grandtotal:number,
              invoiceitem:Invoiceitem[],customer:Customer,invoicestatus:Invoicestatus) {
    this.id=id;
    this.name=name;
    this.date = date;
    this.time = time;
    this.grandtotal = grandtotal;
    this.invoiceitem = invoiceitem;
    this.customer = customer;
    this.invoicestatus = invoicestatus;
  }

}
