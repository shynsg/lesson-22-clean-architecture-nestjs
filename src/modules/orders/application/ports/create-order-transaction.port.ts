import { OutboxEvent } from "../../../outbox/domain/outbox-event.entity";
import { Order } from "../../domain/order.entity";

export const CREATE_ORDER_TRANSACTION = Symbol("CREATE_ORDER_TRANSACTION");

export interface CreateOrderTransaction {
  save(order: Order, events: OutboxEvent[]): Promise<void>;
}
