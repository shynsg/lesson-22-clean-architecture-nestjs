import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from "../../../../shared/messaging/application/ports/event-publisher";
import { ORDER_REPOSITORY, OrderRepository } from "../ports/order-repository.port";

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher,
  ) {}

  async execute(id: string) {
    const order = await this.orders.findById(id);

    await this.publisher.publish({
      id: randomUUID(),
      topic: "order.events",
      occurredAt: new Date().toISOString(),
      type: "order.viewed",
      payload: {
        orderId: id,
        viewerId: "anonymous",
      },
    });

    return {
      order: order ? order.toPrimitives() : null,
    };
  }
}
