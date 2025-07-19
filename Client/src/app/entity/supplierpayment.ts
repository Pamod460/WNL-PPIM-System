import {Paymentstatus} from "./paymentstatus";
import {Paymenttype} from "./paymenttype";
import {Grntype} from "./grntype";
import {Supplier} from "./Supplier";
import {Supplierpaymentgrn} from "./supplierpaymentgrn";

export class Supplierpayment{
  id?: number;
  supplier?: Supplier;
  referenceNo?: string;
  date?: string;
  time?: string;
  amount?: string;
  balance?: string;
  paymentStatus?: Paymentstatus;
  paymentType?: Paymenttype;
  grnType?: Grntype;
  supplierPaymentGrns?: Supplierpaymentgrn[];
  logger?: string;
}
