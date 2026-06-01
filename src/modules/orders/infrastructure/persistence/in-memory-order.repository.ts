import { Order, OrderPrimitives } from "../../domain/order.entity";
import { OrderRepository } from "../../application/ports/order-repository.port";

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, OrderPrimitives>();

  async save(order: Order): Promise<void> {
    const data = order.toPrimitives();
    this.orders.set(data.id, data);
  }

  async findAll(): Promise<Order[] | null> {
    const orders = Array.from(this.orders.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
    if (orders.length === 0) return null;
    return orders.map(Order.fromPrimitives);
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? Order.fromPrimitives(order) : null;
  }

  async findByIdForUpdate(id: string): Promise<Order | null> {
    return this.findById(id);
  }
}
