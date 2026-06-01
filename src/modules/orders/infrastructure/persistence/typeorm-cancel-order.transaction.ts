import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { NotFoundError } from "../../../../shared/domain/errors";
import { OutboxEvent } from "../../../outbox/domain/outbox-event.entity";
import { OutboxMapper } from "../../../outbox/infrastructure/outbox.mapper";
import { OutboxEventOrmEntity } from "../../../outbox/infrastructure/outbox.orm-entity";
import { CancelOrderTransaction } from "../../application/ports/cancel-order-transaction.port";
import { Order } from "../../domain/order.entity";
import { CanCancelOrderSpecification } from "../../domain/specifications/can-cancel-order.specification";
import { OrderMapper } from "./order.mapper";
import { OrderOrmEntity } from "./order.orm-entity";

@Injectable()
export class TypeOrmCancelOrderTransaction implements CancelOrderTransaction {
  private readonly canCancelOrder = new CanCancelOrderSpecification();

  constructor(private readonly dataSource: DataSource) {}

  async execute(orderId: string): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(OrderOrmEntity);

      const orm = await repo.findOne({
        where: { id: orderId },
        lock: { mode: "pessimistic_write" },
      });

      if (!orm) {
        throw new NotFoundError("Order", orderId);
      }

      const order = OrderMapper.toDomain(orm);

      this.canCancelOrder.check(order);
      order.cancel();

      const events = order
        .pullDomainEvents()
        .map((event) => OutboxEvent.fromDomainEvent(event));

      await repo.save(OrderMapper.toOrm(order));

      await manager
        .getRepository(OutboxEventOrmEntity)
        .save(events.map((event) => OutboxMapper.toOrm(event)));

      return order;
    });
  }
}
