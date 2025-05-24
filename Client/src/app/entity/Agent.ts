import {District} from "./District";
import {Route} from "./Route";
import {AgentStatus} from "./AgentStatus";


export interface Agent {
  id: number;
  number: string;
  nic: string;
  fullName: string;
  mobile: string;
  land: string;
  address: string;
  email: string;
  doRegisterd: string;
  description: string;
  longitude: number;
  latitude: number;
  district?: District;
  route?: Route;
  agentStatus?: AgentStatus;

}
