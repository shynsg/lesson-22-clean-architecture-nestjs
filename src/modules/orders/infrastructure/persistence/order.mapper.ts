import { Order } from "../../domain/order.entity";
import { OrderOrmEntity } from "./order.orm-entity";

export class OrderMapper {
  static toOrm(order: Order): OrderOrmEntity {
    const c = order.toPrimitives();
    const orm = new OrderOrmEntity();
    orm.id = c.id;
    orm.customerId = c.customerId;
    orm.status = c.status;
    orm.totalAmount = c.totalAmount;
    orm.subtotalAmount = c.subtotalAmount;
    orm.discountAmount = c.discountAmount;
    orm.items = c.items;
    orm.isVipCustomer = c.isVipCustomer;
    return orm;
  }

  static toDomain(orm: OrderOrmEntity): Order {
    return Order.fromPrimitives({
      id: orm.id,
      customerId: orm.customerId,
      status: orm.status,
      totalAmount: orm.totalAmount,
      subtotalAmount: orm.subtotalAmount,
      discountAmount: orm.discountAmount,
      items: orm.items,
      createdAt: orm.createdAt.toISOString(),
      isVipCustomer: orm.isVipCustomer,
    });
  }
}
