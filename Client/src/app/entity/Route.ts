import {RouteStatus} from "./RouteStatus'";

export class Route{
  id!: number;
  name?: string;
  map?: Uint8Array;
  distance?: number;
  estimatedTime?: number;
  description?: string;
  assignedDate?: string;
  routeStatus?: RouteStatus;
  routeNumber?: string;
  logger?: string;
}
