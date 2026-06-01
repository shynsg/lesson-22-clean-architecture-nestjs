import { Order } from "../../domain/order.entity";

export const PAY_ORDER_TRANSACTION = Symbol("PAY_ORDER_TRANSACTION");

export interface PayOrderTransaction {
  execute(orderId: string): Promise<Order>;
}
