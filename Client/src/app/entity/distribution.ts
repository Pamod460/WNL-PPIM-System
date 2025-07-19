import {AgentOrder} from "./agentOrder";
import {DistributionStatus} from "./distributionstatus";
import {DistributionProduct} from "./distributionProduct";



export class Distribution {
    id!: number;
  agentOrder?: AgentOrder;
  distributionNumber!: string
    desription!: string;
    orderDate!: string
    orderTime!: string
    grandTotal!: number
    logger!: string
  distributionStatus?: DistributionStatus;
  distributionProducts?: DistributionProduct[];
}
