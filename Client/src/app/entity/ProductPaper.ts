import {Paper} from "./Paper";

export interface ProductPaper {
  paper: Paper;
  lineCost: number;
  quantity: number;
  id?: number;
  name?: string;
}
