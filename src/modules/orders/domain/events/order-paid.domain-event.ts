import { randomUUID } from "crypto";
import { DomainEvent } from "../../../../shared/domain/domain-event";
import { OrderPrimitives } from "../order.entity";

export class OrderPaidDomainEvent implements DomainEvent {
  readonly eventId = randomUUID();
  readonly eventType = "order.paid";
  readonly occurredAt = new Date().toISOString();
  readonly aggregateType = "order";
  readonly aggregateId: string;
  readonly payload: Record<string, unknown>;

  constructor(order: OrderPrimitives) {
    this.aggregateId = order.id;
    this.payload = {
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      paidAt: this.occurredAt,
    };
  }
}
