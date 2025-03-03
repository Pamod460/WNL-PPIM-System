import {Employee} from "./employee";
import {Userstatus} from "./userstatus";
import {Userrole} from "./userrole";
import {Usrtype} from "./usrtype";

export class User{

  public id !: number;
  public employee!:Employee;
  public username !: string;
  public password !: string;
  public confirmpassword !: string;
  public userroles!:Userrole[];
  public description !: string;
  public tocreated!:string | null;
  public docreated!:string;
  public usestatus !: Userstatus;
  public usetype !: Usrtype;



  // constructor(id:number, employee:Employee, username:string,
  //             password:string, confirmpassword:string,userroles:Array<Userrole>, description:string,
  //             tocreated:string, docreated:string,userstatus:Userstatus
  //           ){
  //
  //
  //   this.id=id;
  //   this.employee=employee;
  //   this.username=username;
  //   this.password=password;
  //   this.confirmpassword=confirmpassword;
  //   this.userroles = userroles;
  //   this.description=description;
  //   this.tocreated=tocreated;
  //   this.docreated=docreated;
  //   this.userstatus=userstatus;
  // }


}





