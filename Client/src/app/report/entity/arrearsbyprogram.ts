export class ArrearsByProgram {

  public program!: string;
  public no !: number;
  public count !: number;
  public expected !: number;
  public paid !: number;
  public due !: number;
  public arrears !: number;
  public percentage !: number;

  constructor(prgram:string, no:number,count:number,expected:number,paid:number,due:number,arrears:number,percentage:number) {

    this.program = prgram;
    this.no=no;
    this.count=count;
    this.expected=expected;
    this.paid=paid;
    this.due=due;
    this.arrears = arrears;
    this.percentage = percentage;
  }

}
