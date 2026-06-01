import { OrderPrimitives } from "../../domain/order.entity";

export class OrderPresenter {
  static toHttp(order: OrderPrimitives) {
    return {
      id: order.id,
      customerId: order.customerId,
      total: order.totalAmount,
      subtotal: order.subtotalAmount,
      discount: order.discountAmount,
      status: order.status,
      items: order.items,
      createdAt: order.createdAt,
    };
  }
}
