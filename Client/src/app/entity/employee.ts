import {Gender} from "./gender";
import {Designation} from "./designation";
import {Empstatus} from "./empstatus";
import {Emptype} from "./emptype";

export class Employee{

  public id !: number;
  public fullname !: string;
  public number !: string;
  public callingname !: string;
  public photo !: string |null;
  public dobirth !: string;
  public nic !: string;
  public address !: string;
  public mobile !: string;
  public land !: string | null;
  public email !: string;
  public doassignment !: string;
  public description !: string;
  public gender !: Gender;
  public designation !: Designation;
  public employeeStatus !: Empstatus;
  public employeeType !: Emptype;


  constructor(id:number, fullname:string, number:string,
              callingname:string, photo:string, dobirth:string,
              nic:string, address:string, mobile:string,
              land:string,email:string, doassignment:string, description:string,
              gender:Gender, designation:Designation,
              empstatus:Empstatus,
              emptype:Emptype ) {

    this.id=id;
    this.fullname=fullname;
    this.number=number;
    this.callingname=callingname;
    this.photo=photo;
    this.dobirth=dobirth;
    this.nic=nic;
    this.address=address;
    this.mobile=mobile;
    this.land=land;
    this.email=email;
    this.doassignment=doassignment;
    this.description=description;
    this.gender=gender;
    this.designation=designation;
    this.employeeStatus=empstatus;
    this.employeeType=emptype;
  }

}





