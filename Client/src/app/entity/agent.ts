import {District} from "./District";
import {Route} from "./Route";
import {Agentstatus} from "./agentstatus";


export class Agent {
  id!: number;
  number!: string;
  nic!: string;
  fullName!: string;
  mobile!: string;
  land!: string;
  address!: string;
  email!: string;
  doRegisterd!: string;
  description!: string;
  longitude!: number;
  latitude!: number;
  district?: District;
  route?: Route;
  agentStatus?: Agentstatus;

}
