import {CheqStatus} from "./cheqstatus";
import {Bank} from "./bank";

export class CheqPayment {
  id!: number;
  date?: Date;
  cheqNumber?: string;
  dorealized?: string;
  amount?: number;
  description?: string;
  cheqStatus?: CheqStatus;
  bank?: Bank
}
