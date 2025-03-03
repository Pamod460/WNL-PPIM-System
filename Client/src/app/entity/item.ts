export class Item {

  public id !: number;
  public name !: string;
  public saleprice !: number;
  public purchaseprice !: number;
  public quantity !: number;

  constructor(id:number,name:string,saleprice:number,purchaseprice:number,quantity:number) {
    this.id=id;
    this.name=name;
    this.saleprice = saleprice;
    this.purchaseprice = purchaseprice;
    this.quantity = quantity;
  }

}
