import {VehicleStatus} from "./vehiclestatus";
import {VehicleType} from "./vehicletype";
import {VehicleModel} from "./vehiclemodel";


export class Vehicle{

  id!: number;
  number?:string;
  doAttached?:string;
  yom?:number;
  capacity?:number;
  description?:string;
  curruntMeterReading?:number;
  lastRegDate?:string;
  vehicleStatus?:VehicleStatus;
  vehicleType?:VehicleType;
  vehicleModel?:VehicleModel;

}


