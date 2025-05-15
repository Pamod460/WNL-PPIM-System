import {Paper} from "./Paper";

export interface ProductPaper {
  paper: Paper;
  linecost: number;
  quantity: number;
  id?: number;
  name?: string;
}
