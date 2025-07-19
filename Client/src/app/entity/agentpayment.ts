import {Distribution} from "./distribution";
import {AgentPaymentType} from "./agentPaymentType";
import {Paymentstatus} from "./paymentstatus";
import {CheqPayment} from "./cheqPayment";

export class AgentPayment{
  id!: number;
  date?: Date;
  amount?: number;
  description?: string;
  distribution?: Distribution;
  agentPaymentType?: AgentPaymentType;
  paymentStatus?:Paymentstatus;
  cheqPayments?: CheqPayment[];
  logger?: string;
}
