import { Order } from "../../domain/order.entity";

export const CANCEL_ORDER_TRANSACTION = Symbol("CANCEL_ORDER_TRANSACTION");

export interface CancelOrderTransaction {
  execute(orderId: string): Promise<Order>;
}
