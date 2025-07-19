import {AgentOrderStatus} from "./agentOrderStatus";
import {Agent} from "./agent";
import {AgentOrderProduct} from "./agentorderproduct";



export class AgentOrder {
    id!: number;
    agent?: Agent;
    orderNumber!: string
    desription!: string;
    orderDate!: string
    orderTime!: string
    grandTotal!: number
    logger!: string
    agentOrderStatus?: AgentOrderStatus;
    agentOrderProducts?: AgentOrderProduct[];
}
