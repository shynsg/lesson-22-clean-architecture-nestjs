import { randomUUID } from "crypto";
import { DomainEvent } from "../../../../shared/domain/domain-event";
import { OrderPrimitives } from "../order.entity";

export class OrderCreatedDomainEvent implements DomainEvent {
  readonly eventId = randomUUID();
  readonly eventType = "order.created";
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
      subtotalAmount: order.subtotalAmount,
      discountAmount: order.discountAmount,
      status: order.status,
      createdAt: order.createdAt,
      isVipCustomer: order.isVipCustomer,
      items: order.items,
    };
  }
}
