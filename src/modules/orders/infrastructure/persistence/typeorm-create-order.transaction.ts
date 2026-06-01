import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { OutboxEvent } from "../../../outbox/domain/outbox-event.entity";
import { OutboxMapper } from "../../../outbox/infrastructure/outbox.mapper";
import { OutboxEventOrmEntity } from "../../../outbox/infrastructure/outbox.orm-entity";
import { CreateOrderTransaction } from "../../application/ports/create-order-transaction.port";
import { Order } from "../../domain/order.entity";
import { OrderMapper } from "./order.mapper";
import { OrderOrmEntity } from "./order.orm-entity";

@Injectable()
export class TypeOrmCreateOrderTransaction implements CreateOrderTransaction {
  constructor(private readonly dataSource: DataSource) {}

  async save(order: Order, events: OutboxEvent[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OrderOrmEntity).save(OrderMapper.toOrm(order));

      const outboxRows = events.map((event) => OutboxMapper.toOrm(event));

      await manager.getRepository(OutboxEventOrmEntity).save(outboxRows);
    });
  }
}
